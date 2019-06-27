const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let dataList = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

io.set('origins', '*:*');
io.on('connection', function(socket) {
    console.log('connect!');
    socket.on('error', (error) => {console.log(error)});


});

server.listen(process.env.PORT || 8080);

// rmqqhtOaXc62kWVq