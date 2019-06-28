const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const uuid = require('uuidv4')
let GameData = {};
let seed = '1';

// for frontend test
GameData['temp'] = {
    playerNames: [],
    allPlayers: []
}

// Create server to serve index.html
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 8080;

// Routing
app.use(express.static('public'));

// Socket.io serverSocket
const serverSocket = require('socket.io')(http);
// serverSocket.set('origins', '*:*');

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
        socket.on('newPlayer', (data) => {
            let uid = uuid();
            let team = GameData['temp'].playerNames.length % 2 ? 'B' : 'A'

            GameData['temp'].playerNames.push({
                name: data.name,
                uid: uid,
                team: team
            })

            socket.emit('getRoomId', {
                roomId: 'temp',
                uid: uid,
                team: team
            })
        });

        socket.on('getRoomPlayers', (data) => {
            let teamA = GameData[data.roomId].playerNames.filter(p => p.team === 'A');
            let teamB = GameData[data.roomId].playerNames.filter(p => p.team === 'B');

            serverSocket.emit('getRoomPlayers', {
                teamA: teamA,
                teamB: teamB
            })
        });

        socket.on('enterGame', (data) => {
            GameData[data.roomId].allPlayers.push(data);
        });

        socket.on('updateGame', (data) => {
            // console.log('updataGame data: ', data);
            GameData[data.roomId].allPlayers.forEach(p => {
                if (p.playerUid === data.playerUid) {
                    console.log('catch');
                    return data;
                }
                else {
                    console.log('oh no')
                    return p;
                }
            });
            // console.log('GameData: ', GameData[data.roomId].allPlayers[0]);
            serverSocket.emit('updateGame', {
                allPlayers: GameData[data.roomId].allPlayers
            });
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