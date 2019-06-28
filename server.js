const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const uuid = require('uuidv4')
let GameData = {};
let seed = '1234';

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
            // no room
            if (!GameData) {
                roomId = seed
                socket.join(roomId)
                GameData[roomId] = {
                    playersBasicInfo: [],
                    allPlayers: []
                }
            }
            // find valid room
            else {
                Object.keys(GameData).forEach(id => {
                    if (GameData[id].playersBasicInfo.length < 4) roomId = id;
                }) 
            }
            // no valid room
            if (!roomId) {
                seed = (parseInt(seed) * 1213 % 9973).toString();
                roomId = seed;
                socket.join(roomId);
                GameData[roomId] = {
                    playersBasicInfo: [],
                    allPlayers: []
                }
            }

            // determine which team to join
            if (GameData[roomId].playersBasicInfo.length === 0) team = 'A';
            else {
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
                team: team
            })
        });

        socket.on('getRoomPlayers', (data) => {
            let teamA = GameData[data.roomId].playersBasicInfo.filter(p => p.team === 'A');
            let teamB = GameData[data.roomId].playersBasicInfo.filter(p => p.team === 'B');

            serverSocket.emit('getRoomPlayers', {
                teamA: teamA,
                teamB: teamB
            })
        });

        socket.on('enterGame', (data) => {
            GameData[data.roomId].allPlayers.push(data);
        });

        socket.on('updateGame', (data) => {
            GameData[data.roomId].allPlayers = GameData[data.roomId].allPlayers.map(p => {
                if (p.playerUid === data.playerUid) { return data; }
                else { return p; }
            });
            serverSocket.emit('updateGame', {
                allPlayers: GameData[data.roomId].allPlayers
            });
        });

        socket.on('disconnect', () => {
            if (GameData[roomId]) {
                GameData[roomId].playersBasicInfo = GameData[roomId].playersBasicInfo.filter(
                    p => !(p.uid === socket.id)
                );
                GameData[roomId].allPlayers = GameData[roomId].allPlayers.filter(
                    p => !(p.playerUid === socket.id)
                );
            }
        });

        // socket.on('joinRoom', (data) => {
        //     socket.join(data.roomId);
        //     console.log(data.name, 'join Room', roomId, 'successfully.')
        // });

        // socket.on('leaveRoom', () => {
        //     socket.emit('disconnect');
        // });

    })
})