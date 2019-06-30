const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const uuid = require('uuidv4');
const MAX_PLAYERS = 4;
const GAME_TIME = 60;
const WAIT_TIME = 15;
let GameData = {};
let SEED = '1234';
const GAME_STATE = {
    WAITING: 1,
    GAMING: 2,
    FREEZE: 3,
    FINISH: 4
};

const getNextSeed = () => {
    while(GameData[SEED]) {
        SEED = (parseInt(SEED) * 1213 % 9973).toString();
    }
    return SEED
}

const generateColorId = () => {
    let len = 4
    let color = [];
    while (color.length < 2) {
        let c = Math.floor(Math.random() * len);
        if (color.indexOf(c) === -1) color.push(c);
    }
    return color;
}

let startGameTimeCountdown = (serverSocket, roomId) => {
    let gameIntervalId = setInterval(() => {
        if (GameData[roomId]) {
            console.log(GameData[roomId].gameTime)
            GameData[roomId].gameTime--;
            if (GameData[roomId].gameTime <= -6) {
                clearInterval(gameIntervalId);
                GameData[roomId].status = GAME_STATE.FINISH;
                serverSocket.to(roomId).emit('endGaming');
            }
        }
    }, 1000)
}

let getRoomPlayers = (serverSocket, roomId) => {
    if (GameData[roomId]) {
        serverSocket.to(roomId).emit('getRoomPlayers', {
            teamA: GameData[roomId].playersBasicInfo.filter(p => p.team === 'A'),
            teamB: GameData[roomId].playersBasicInfo.filter(p => p.team === 'B'),
            maxPlayers: MAX_PLAYERS,
            waitTime: GameData[roomId].waitTime
        });

        if (GameData[roomId].playersBasicInfo.length < MAX_PLAYERS ||
            !GameData[roomId].playersBasicInfo.every(p => p.inWaitingRoom)) {
            clearInterval(GameData[roomId].waitIntervalId);
            GameData[roomId].waitTime = WAIT_TIME;
        }
        else if (GameData[roomId].playersBasicInfo.length === MAX_PLAYERS &&
            GameData[roomId].playersBasicInfo.every(p => p.inWaitingRoom)) {
            GameData[roomId].waitIntervalId = setInterval(() => {
                if (GameData[roomId]) {
                    serverSocket.to(roomId).emit('getWaitTime', {
                        waitTime: GameData[roomId].waitTime
                    })
                    GameData[roomId].waitTime--;
                    if (GameData[roomId].waitTime < 0) {
                        clearInterval(GameData[roomId].waitIntervalId);
                        serverSocket.to(roomId).emit('startGaming');
                        GameData[roomId].status = GAME_STATE.GAMING;
                        GameData[roomId].gameTime = GAME_TIME;
                        GameData[roomId].playersBasicInfo.map(p => { p.inWaitingRoom = 0 });
                        startGameTimeCountdown(serverSocket, roomId);
                    }
                }
            }, 1000)
        }
    }
}

// Create server to serve index.html
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT || 8080;

// Routing
app.use(express.static('build'));

// Socket.io serverSocket
const serverSocket = require('socket.io')(http);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// Start server listening process.
http.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});

// Connect to mongo
mongoose.connect('mongodb+srv://cc41516:test@splat-l9jbz.mongodb.net/SPLAT?retryWrites=true&w=majority', {
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

        socket.on('error', (err) => { console.log(err); });

        socket.on('login', (data) => {
            if (data) {
                User.find({ email: data.email, password: data.password,}).limit(1).exec((err, res) => {
                    if (err) throw err;
                    else if (res.length === 0) {
                        socket.emit('recievedlogin', {
                            message: 'Invalid input. Please input correct emain and password.'
                        })
                    } 
                    else {
                        socket.emit('recievedlogin', {
                            message: 'OK', 
                            userName: res[0].name,
                            userStatus: {
                                winning: res[0].winning,
                                kill: res[0].kill
                            }
                        })
                    }
                })
            }
        })

        socket.on('signup', (data) => {
            if (data) {
                if (!data.name || !data.email || !data.password) {
                    socket.emit('recievedsignup', {
                        message: 'Please complete all necessary data.'
                    })
                }
                else {
                    User.find({ email: data.email }).limit(1).exec((err, res) => {
                        if (err) throw err;
                        else if (res.length > 0) {
                            socket.emit('recievedlogin', {
                                message: `${res[0].email} has been signed up. Please change a new email.`
                            })
                        }
                        else {
                            const user = new User({
                                name: data.name,
                                email: data.email,
                                password: data.password,
                                winning: 0,
                                kill: 0
                            })
                            user.save(err => {
                                if (err) console.error(err)
                                else socket.emit('recievedsignup', {
                                    message: 'OK',
                                    userName: data.name,
                                    userStatus: {
                                        winning: 0,
                                        kill: 0
                                    }
                                })
                            })
                        }
                    })
                }
            }
        })

        socket.on('newPlayer', (data) => {
            // determine which room to join
            // find valid room
            if (GameData) {
                Object.keys(GameData).forEach(id => {
                    if (GameData[id].playersBasicInfo.length < MAX_PLAYERS &&
                        GameData[id].status !== GAME_STATE.GAMING) {
                        roomId = id;
                        socket.join(roomId);
                    }
                })
            }
            // no valid room
            if (!roomId) {
                let color = generateColorId();
                SEED = getNextSeed();
                roomId = SEED;
                socket.join(roomId);
                GameData[roomId] = {
                    playersBasicInfo: [],
                    allPlayers: [],
                    teamColor: {
                        A: color[0],
                        B: color[1]
                    },
                    status: GAME_STATE.WAITING,
                    gameTime: GAME_TIME,
                    waitTime: WAIT_TIME,
                    anouncement: [],
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
                team: team,
                kill: 0,
                inWaitingRoom: 1,
                autoKick: 0
            })

            socket.emit('getFirstInInfo', {
                roomId: roomId,
                uid: uid,
                team: team,
                teamColor: GameData[roomId].teamColor,
            })
        });

        socket.on('getRoomPlayers', (data) => {
            // if player come back from game
            // if (GameData[data.roomId]) {
            //     GameData[data.roomId].playersBasicInfo.map(p => {
            //         if (p.uid === data.uid) p.inWaitingRoom = 1;
            //     })
            // }
            getRoomPlayers(serverSocket, data.roomId)
        });

        socket.on('enterGame', (data) => {
            if (GameData[data.roomId]) {
                GameData[data.roomId].allPlayers.push(data);
            }
        });

        socket.on('updateGame', (data) => {
            if (GameData[data.roomId]) {
                GameData[data.roomId].allPlayers = GameData[data.roomId].allPlayers.map(p => {
                    if (p.playerUid === data.playerUid) { return data; }
                    else { return p; }
                });
                socket.broadcast.to(data.roomId).emit('updateGame', {
                    allPlayers: GameData[data.roomId].allPlayers,
                });
                socket.emit('getGameTime', {
                    gameTime: GameData[data.roomId].gameTime
                })
            }
        });

        socket.on('killEvent', (data) => {
            if (GameData[data.roomId]) {
                GameData[data.roomId].playersBasicInfo.map(p => {
                    if (p.playerUid === data.killerUid) p.kill += 1;
                })
                serverSocket.to(data.roomId).emit('killEvent', {
                    killerName: data.killerName,
                    killedName: data.killedName
                });
            }
        })

        socket.on('enterResult', (data) => {
            if (GameData[data.roomId]) {
                GameData[data.roomId].playersBasicInfo.map(p => {
                    if (p.uid === data.uid) {
                        p.autoKick = 1;
                        setTimeout(() => {
                            if (p.autoKick) socket.emit('kickOut');
                        }, 10 * 1000)
                    }

                })
            }
        })

        socket.on('backToWaitRoom', (data) => {
            if (GameData[data.roomId]) {
                GameData[data.roomId].playersBasicInfo.map(p => {
                    if (p.uid === data.uid) {
                        p.autoKick = 0;
                        p.inWaitingRoom = 1;
                    }
                })
            }
        })

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