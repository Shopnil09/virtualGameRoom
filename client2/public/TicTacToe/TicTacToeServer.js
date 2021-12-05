/**
 * Michael 
 * Corresponding server for TicTacToe.js
 * Receives signals from one client sends them back to all clients
 * 
 * ---------------------------------------------------------------------------
 * To test: 
 * 1- cd to "ticTacToeMultiplayer" folder
 * 2- enter "npm install" into the terminal
 * 3- enter "npm install -g nodemon" into the terminal
 * 4- enter "nodemon TicTacToeServer.js" into the terminal, without the quotes
 * 5- Then, open two tabs at address http://localhost:3000/TictacToe.html
 * -----------------------------------------------------------------------------
 */

//socket stuff
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/');
const port = process.env.PORT || 3003;
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

    //receives change in turn, sends it to all clients
    socket.on('nextTurn', (data) => {
        console.log('playerTurn is', data);
        io.emit('nextTurn', data);
    })

    //receives change in the symbol placed on a space, 
    //sends it to all clients (game logic)
    socket.on('updateSpace', (data) => {
        console.log('space: ', data.space);
        console.log('playerTurn: ', data.playerTurn);
        io.emit('updateSpace', data);
    })

    //receives change in the symbol placed on a space, 
    //sends it to all clients (user interface)
    socket.on('updateCSS', (data) => {
        console.log('css element being updated: ', data);
        io.emit('updateCSS', data);
    })

    //receives change in retry variable, sends to all clients
    socket.on('retry?', (data) => {
        console.log('retry = ', data);
        io.emit('retry', data);
    })

    //receives signal to trigger gameOverCheck, sends to all clients
    socket.on('gameOverCheck', () => {
        console.log('gameOverCheck');
        io.emit('gameOverCheck');
    })

    //receives choice of singleplayer or multiplayer, 
    //sends signal back to all clients
    socket.on('singleplayer?', (data) => {
        console.log('singleplayer is', data);
        io.emit('singleplayer?', data);
    })

    //receives signal to reset board, 
    //sends signal back to all clients
    socket.on('reset', () => {
        console.log('reset');
        io.emit('reset');
    })
    

});