/**
 * Michael Raffel socket update, local multiple-client multiplayer
 * 
 * ---------------------------------------------------------------------------
 * To test: 
 * 1- cd to "Rock Paper Scissors update" folder
 * 2- enter "npm install" into the terminal
 * 3- enter "npm install -g nodemon" into the terminal
 * 4- enter "nodemon RPSserver.js" into the terminal, without the quotes
 * 5- Then, open two tabs at address http://localhost:3000/Rock_Paper_Scissors.html
 * -----------------------------------------------------------------------------
 * 
 * Okay, so basically what's happening here is that the game is sending 
 * any changes in variables to the server, which is then sent back to all 
 * clients. 
 * 
 * For example, there are 2 tabs up. Player on one tab chooses paper first 
 * (and is thus player 1). This change is updated for both clients, so if 
 * player 2 chooses rock, Player 1 wins.
 * 
 * Right now, all that is being updated between clients are the player choices 
 * and the turn number that updates after said choices. I'm still working on everything 
 * else
 * 
 * Contributing/following along shouldn't be too hard. Basically, every time you want to send 
 * any important information to the server to be updated on every client, follow 
 * these steps: 
 * 
 * -----------------------------------------------------------------------------
 * 1- when the variable changes on the client side, just include one of these afterwards: 
 * 
 * socket.emit('messageName', variableYouWantToUpdateForAllClients);
 * 
 * (see my examples in the code)
 * This will send that change to the server
 * 
 * 
 * 2- go to the server file (RPSserver.js), and slap one of these under the others: 
 * 
 * socket.on('messageName', (data) => {
 *      console.log('this log is just for testing purposes:', data);
 *      io.emit('messageName', data);
 *  })
 *
 *  (see my examples in the code)
 *  This will receive the change and send it BACK to all clients
 *
 *
 *  3- go back to RockPaperScissors.js and include one of these with the others: 
 *
 *  socket.on('messageName', (data) => {
 *      variableYouWantToUpdateForAllClients = data;
 *  })
 *
 *  (see my examples in the code)
 *  Here, all clients are receiving the data back, and will update the variable accordingly
 * -----------------------------------------------------------------------------
 *
 *  GGEZ (let me know if you run into issues)
 */

// setting up the socket
let socket = io();

//player 1's choice
var playerOneChoice;
//player 2's choice
var playerTwoChoice;
var singleplayer= false;
var playerTurn = 1;

// the gameflow for each round
function RPSRound(x){
    document.getElementById("oneplayer").disabled = true;
    document.getElementById("twoplayer").disabled = true;
    makeSelection(x);
    if (singleplayer){
        AI_RPS();
    }
    if (playerTurn>2){
        //RPSWinCheck();
        //sends signal to server to initiate winCheck for both clients
        socket.emit('winCheck');
    }
    

}

//listens for server and updates choice for all clients
socket.on('p1choice', (data) => {
    playerOneChoice = data;
    //console.log('p1choice:: ', data);
});

//listens for server and updates choice for all clients
socket.on('p2choice', (data) => {
    playerTwoChoice = data;
    //console.log('p2choice:: ', data);
});

//listens for server and updates turn for all clients
socket.on('nextTurn', (data) => {
    playerTurn = data;
    //console.log('playerTurn:: ', data);
});

//listens for signal to perform win check, all clients get message
socket.on('winCheck', () => {
    RPSWinCheck();
});

//listens to server for whether to play singleplayer or multiplayer, 
//updates for all clients
socket.on('singleplayer?', (data) => {
    singleplayer = data;
    document.getElementById("oneplayer").disabled = true;
    document.getElementById("twoplayer").disabled = true;
	document.getElementById("button").disabled = true;
});

//listens for appropriate message from server for AI choice, 
//all clients get message
socket.on('AIchoice', (data) => {
    alert("The AI has picked ", data);
});

//selects either rock, paper, or scissors
function makeSelection(choice){
    if (playerTurn == 1){
        playerOneChoice = choice;
        //sends player choice to server
        socket.emit('p1choice', choice);
    } else {
        playerTwoChoice = choice;
        //sends player choice to server
        socket.emit('p2choice', choice);
    }
    playerTurn ++;
    //sends turn number to server
    socket.emit('nextTurn', playerTurn);
}

//checks to see who won, or if there's a tie
function RPSWinCheck(){
    alert("Player One: " + playerOneChoice + 
        "\nPlayer Two: " + playerTwoChoice);

    if (playerOneChoice == playerTwoChoice){
        alert("Its a tie!");
        playerTurn = 1;
        document.getElementById("oneplayer").disabled = false;
        document.getElementById("twoplayer").disabled = false;
        return;
    }
    if(playerOneChoice == "rock"){
        if (playerTwoChoice == "paper"){
            alert("Player Two wins");
        } else {
            alert("Player One Wins");
        }
        playerTurn = 1;
    }
    else if( playerOneChoice == "paper"){
        if (playerTwoChoice == "scissors"){
            alert("Player Two wins");
        } else {
            alert("Player One wins")
        }
        playerTurn = 1;
    }
    else if( playerOneChoice == "scissors"){
        if (playerTwoChoice == "rock"){
            alert("Player Two wins");
        } else {
            alert("Player One wins")
        }
        playerTurn = 1;
    }
    document.getElementById("oneplayer").disabled = false;
    document.getElementById("twoplayer").disabled = false;
}

// changes between single and multiplayer depending on button press
function PlayerSelection(button){
    if(button.value == "1"){
        singleplayer = true;
    } else {
        singleplayer = false;
    }
    //sends choice to server
    socket.emit('singleplayer?', singleplayer);

    document.getElementById("oneplayer").disabled = true;
    document.getElementById("twoplayer").disabled = true;
	document.getElementById("button").disabled = true;

}

// AI choice for when playing singleplayer
function AI_RPS(){
    var aiselect = Math.floor(Math.random() * 3);

    if (aiselect == 0){
        makeSelection("rock");
        socket.emit('AIchoice', "rock");
        //alert("The AI has picked rock");
    } else if (aiselect == 1){
        makeSelection("scissors");
        socket.emit('AIchoice', "scissors");
        //alert("The AI has picked scissors");
    } else {
        makeSelection("paper");
        socket.emit('AIchoice', "paper");
        //alert("The AI has picked paper");
    }
    console.log(aiselect);

}

