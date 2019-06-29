const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const uuid = require('uuidv4');
let GameData = {};
let seed = '1234';

let generateColorId = () => {
    let l = 4
    let color = [];
    while (color.length < 2) {
        let c = Math.floor(Math.random() * l);
        if (color.indexOf(c) === -1) color.push(c);
    }
    return color
}

let getRoomPlayers = (serverSocket, roomId) => {
    let teamA = GameData[roomId].playersBasicInfo.filter(p => p.team === 'A');
    let teamB = GameData[roomId].playersBasicInfo.filter(p => p.team === 'B');

    serverSocket.to(roomId).emit('getRoomPlayers', {
        teamA: teamA,
        teamB: teamB,
    })
}

// Create server to serve index.html
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 8080;

// Routing
app.use(express.static('public'));

// Socket.io serverSocket
const serverSocket = require('socket.io')(http);

// Start server listening process.
http.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});

// Connect to mongo
mongoose.connect('mongodb+srv://cc41516:test@splat-l9jbz.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true
});
db = mongoose.connection;

db.on('error', error => { console.log(error) })
db.once('open', () => {
    console.log('MongoDB connected!')
    serverSocket.on('connection', socket => {
        let uid = socket.id;
        let roomId = null;
        let team = null;
        
        socket.on('newPlayer', (data) => {
            // determine which room to join
            // find valid room
            if (GameData) {
                Object.keys(GameData).forEach(id => {
                    if (GameData[id].playersBasicInfo.length < 4) {
                        roomId = id;
                        socket.join(roomId);
                    }
                }) 
            }
            // no valid room
            if (!roomId) {
                seed = (parseInt(seed) * 1213 % 9973).toString();
                roomId = seed;
                socket.join(roomId);
                GameData[roomId] = {
                    playersBasicInfo: [],
                    allPlayers: [],
                    teamColor: generateColorId()
                }
            }

            // determine which team to join
            team = 'A';
            if (GameData[roomId].playersBasicInfo.length > 0) {
                let numberA = GameData[roomId].playersBasicInfo.filter(p => p.team === 'A').length;
                let numberB = GameData[roomId].playersBasicInfo.length - numberA;
                if (numberA > numberB) team = 'B';
            }

            // add player info to the room
            GameData[roomId].playersBasicInfo.push({
                name: data.name,
                uid: uid,
                team: team
            })

            socket.emit('getPlayerBasicInfo', {
                roomId: roomId,
                uid: uid,
                team: team,
                teamColor: GameData[roomId].teamColor
            })
        });

        socket.on('getRoomPlayers', (data) => {
            getRoomPlayers(serverSocket, data.roomId)
        });

        socket.on('enterGame', (data) => {
            GameData[data.roomId].allPlayers.push(data);
        });

        socket.on('updateGame', (data) => {
            GameData[data.roomId].allPlayers = GameData[data.roomId].allPlayers.map(p => {
                if (p.playerUid === data.playerUid) { return data; }
                else { return p; }
            });
            socket.broadcast.to(data.roomId).emit('updateGame', {
                allPlayers: GameData[data.roomId].allPlayers
            });
        });

        socket.on('disconnect', () => {
            if (GameData[roomId]) {
                // kick player out of room
                GameData[roomId].playersBasicInfo = GameData[roomId].playersBasicInfo.filter(
                    p => !(p.uid === socket.id)
                );
                GameData[roomId].allPlayers = GameData[roomId].allPlayers.filter(
                    p => !(p.playerUid === socket.id)
                );
                // if the room is empty, then clear it
                if (GameData[roomId].playersBasicInfo.length === 0) {
                    delete GameData[roomId];
                }
                // else emit to other players
                else {
                    getRoomPlayers(serverSocket, roomId);
                }
            }
        });
    })
})