/**
 * Michael 
 * Corresponding server for RockPaperScissors.js
 * Receives signals from one client sends them back to all clients
 * 
 * ---------------------------------------------------------------------------
 * To test: 
 * 1- cd to "Rock Paper Scissors update" folder
 * 2- enter "npm ci" into the terminal
 * 3- enter "npm install -g nodemon" into the terminal
 * 4- enter "nodemon RPSserver.js" into the terminal, without the quotes
 * 5- Then, open two tabs at address http://localhost:3000/Rock_Paper_Scissors.html
 * -----------------------------------------------------------------------------
 */

 //socket stuff
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/');
const port = process.env.PORT || 3002;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(publicPath));

// displays message when server is up
server.listen(port, ()=> {
    console.log(`Server is up on port ${port}.`)
});

// user connects to server
io.on('connection', (socket) => {
	console.log('A user just connected.');
    socket.on('disconnect', () => {
        console.log('A user has disconnected.');
    })

    //receives a player's choice, sends it to all clients
    socket.on('p1choice', (data) => {
        console.log('p1choice is', data);
        io.emit('p1choice', data);
    })

    //receives a player's choice, sends it to all clients
    socket.on('p2choice', (data) => {
        console.log('p2choice is', data);
        io.emit('p2choice', data);
    })

    //receives change in turn, sends it to all clients
    socket.on('nextTurn', (data) => {
        console.log('playerTurn is', data);
        io.emit('nextTurn', data);
    })

    //receives signal to perform win check, sends signal
    //back to all clients
    socket.on('winCheck', () => {
        console.log('performing win check');
        io.emit('winCheck');
    })

    //receives choice of singleplayer or multiplayer, 
    //sends signal back to all clients
    socket.on('singleplayer?', (data) => {
        console.log('singleplayer is', data);
        io.emit('singleplayer?', data);
    })

    //receives AI's choice, returns it in a message for all clients
    socket.on('AIchoice', (data) => {
        console.log('AI choice: ', data);
        io.emit('AIchoice', data);
    })

});