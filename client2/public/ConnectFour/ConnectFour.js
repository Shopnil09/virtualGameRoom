/*

/*
Michael Raffel
9/30/21
10/13/21

Connect Four game that utilizes simple html commands 
(alert, prompt) to showcase the logic of the game before it 
is implemented properly via css/html.
Supports local play where two players take turns at the computer 
choosing spaces (referred to as 0-8), as well as basic AI.

------------

Julian/Michael socket update, local multiple-client multiplayer
Corresponding server is C4server.js
-----------------------------------------------------------------------------
* To test: 
* 1- cd to "ConnectFour" folder
* 2- enter "npm install" into the terminal
* 3- enter "npm install -g nodemon" into the terminal
* 4- enter "nodemon C4server.js" into the terminal, without the quotes
* 5- Then, open two tabs at address http://localhost:3000/ConnectFour.html
* -----------------------------------------------------------------------------

*/


// setting up the socket
let socket = io();


// number of columns on the board
var columnNumber = 7;
// number of rows on the board
var rowNumber = 6;
// representation of the board
var board;
// stores which player's turn it is (alternates between 1 and 2)
var playerTurn;
// ends the game loop when isGameOver = true
var isGameOver;
// the game is played again if isPlayingAgain == true
var isPlayingAgain;
// determines whether to play with a human or AI
var isSinglePlayer = false;

//listens to server for whether to play singleplayer or multiplayer, 
//updates for all clients
socket.on('singleplayer?', (data) => {
    isSingleplayer = data;
    document.getElementById("oneplayer").disabled = true;
    document.getElementById("twoplayer").disabled = true;
	document.getElementById("button").disabled = true;
});

//listens for server and updates turn for all clients
socket.on('nextTurn', (data) => {
    playerTurn = data;
});
//updates board space for all clients (game-logic)
socket.on('updateSpace', (data) => {
    board[data.col][data.row] = data.playerTurn;
});

//updates board space for all clients (user interface)
socket.on('updateCSS', (data) => {
    document.getElementById(data.val).style.backgroundColor = data.color;
    document.getElementById(data.val).setAttribute("oldcolor",document.getElementById(data.val).style.backgroundColor);
});

//updates retry variable for all clients
socket.on('reset', () => {
    location.reload();
});

//triggers gameOverCheck for all clients
socket.on('gameOverCheck', () => {
    isGameOver = gameOverCheck();
});

// initializes board
function initializeBoard()
{
    // [column][row]
    // create a 2D array to represent the columns and rows
    board = new Array(columnNumber);
    for (var i = 0; i < board.length; i++)
    {
        board[i] = new Array(rowNumber);
    }
    isGameOver = false;
    playerTurn = 1;
}

// displays the board
function displayBoard()
{
    // representation of each row
    var boardString = ['', '', '', '', '', ''];
    // representation of board that is pieced together at the end
    var alertDisplayString = '';

    //column by column
    for (var i = 0; i < board.length; i++)
    {
        //row by row (for each column)
        for (var j = 0; j < board[i].length; j++)
        {
            if (board[i][j] == null)
            {
                boardString[j] = boardString[j].concat('__ ', ' ');
            
            }
            else
            {
                boardString[j] = boardString[j].concat(' ', board[i][j], '  ');
                //console.log(i + ' ' + j);
            }
        }
    }


    for (var i = 0; i < boardString.length; i++)
    {
        //console.log(boardString[i]);
        alertDisplayString = alertDisplayString.concat(boardString[i], '\n');
    }

    alert(alertDisplayString);
}

// updates the CSS for the board
function updateBoard(column,row){
    var color;
    if (playerTurn ==1){
        color = "red";
    } else {
        color = "blue";
    }
    var val;
    switch(column){
        case 0:
            val = "c1".concat(checkRow(row));
            remHighlight("c1");
            break;
        case 1:
            val = "c2".concat(checkRow(row));
            remHighlight("c2");
            break;
        case 2:
            val = "c3".concat(checkRow(row));
            remHighlight("c3");
            break;
        case 3:
            val = "c4".concat(checkRow(row));
            remHighlight("c4");
            break;
        case 4:
            val = "c5".concat(checkRow(row));
            remHighlight("c5");
            break;
        case 5:
            val = "c6".concat(checkRow(row));
            remHighlight("c6");
            break;
        case 6:
            val = "c7".concat(checkRow(row));
            remHighlight("c7");
            break;
    }
    socket.emit('updateCSS', {
        val: val, 
        color: color
    });
}

// Checks which row is being updated in the updateBoard() function.
// Returns the corresponding identifier for the CSS to update
function checkRow(row){
    switch(row){
        case 0:
            return "r6";
        case 1:
            return "r5";
        case 2:
            return "r4";
        case 3:
            return "r3";
        case 4:
            return "r2";
        case 5:
            return "r1";

    }
    

}

// Drops piece in the column selected by the player.
// Piece falls to the bottom of the board.
// Returns true if successful, false if invalid or overfilled.
function dropPiece(column, player)
{
    if ((column >= 0) && (column < columnNumber) && (column != null))
    {
        // do nothing, all good
    }
    else
    {
        return false;
    }

    for (var i = board[column].length - 1; i >= 0; i--)
    {
        if (board[column][i] == null)
        {
            board[column][i] = player;
            //sends board space and placed symbol to the server
            socket.emit('updateSpace', {
             col: column,
             row: i, 
             playerTurn: player
            });
            updateBoard(column,i);
            return true;
        }
    }
    return false;
}

// Checks for 4 consecutive matches, as well as a full board. 
// Ends the game when it returns true.
function gameOverCheck()
{
    //alert("gameOverCheck");
    var winner;

    winner = horizontalCheck();
    if (winner)
    {
        showWinner(winner);
        return winner;
    }

    winner = verticalCheck();
    if (winner)
    {
        showWinner(winner);
        return winner;
    }

    winner = diagonalCheck();
    if (winner)
    {
        showWinner(winner);
        return winner;
    }

    if (boardFullCheck())
    {
        showWinner(winner);
        return true;
    }

    return false;
}

// checks for 4 in a row, returns the winning player, 
// if any
function horizontalCheck()
{
    //alert("horizontalCheck");
    // iterate through the rows
    for (var j = 0; j < rowNumber; j++)
    {
        // number of identical adjacent spaces 
        // 4 identical adjacent spaces means 4 in a row
        var adjacentSpace = 1;

        // interate through the columns
        for (var i = 0; i < (board.length - 1); i++)
        {
            //alert("board[" + i + "][" + j + "]");
            if ((board[i][j] == board[i + 1][j]) && (board[i][j] != null))
            {
                // streak continues
                adjacentSpace++;
            }
            else
            {
                // streak is broken, reset to 1 in a row
                adjacentSpace = 1;
            }

            // the game is won if there are 4 
            // or more in a row
            if (adjacentSpace >= 4)
            {
                return board[i][j];
            }
        }
    }

    return;
}

// checks for 4 consecutive pieces in a column, 
// returns the winning player, if any
function verticalCheck()
{
    //alert("verticalCheck");
    // iterate through the columns
    for (var i = 0; i < board.length; i++)
    {
        // number of identical adjacent spaces 
        // 4 identical adjacent spaces means 4 in a "row" (column)
        var adjacentSpace = 1;

        // interate through the rows
        for (var j = 0; j < board[i].length; j++)
        {
            //alert("board[" + i + "][" + j + "]");
            if ((board[i][j] == board[i][j + 1]) && (board[i][j] != null))
            {
                // streak continues
                adjacentSpace++;
            }
            else
            {
                // streak is broken, reset to 1 in a "row" (column)
                adjacentSpace = 1;
            }

            // the game is won if there are 4 
            // or more in a "row" (column)
            if (adjacentSpace >= 4)
            {
                return board[i][j];
            }
        }
    }

    return;
}

// checks for 4 consecutive pieces diagonally, 
// returns the winning player, if any
function diagonalCheck()
{
    //alert("diagonalCheck");
    // Starting from the upper left corner, 
    // try to find matches in a downwards right
    // diagonal pattern.
    // Then, start from just below the 
    // upper left corner. Repeat until a 
    // match is found, or until there is an
    // attempt to start at the bottom left corner.
    var adjacentSpace;
    //row by row
    for (var j = 0; j < rowNumber; j++)
    {
        adjacentSpace = 1;
        // for each row, start left, then move diagonally down and right
        for (var i = 0; ((i + j) < rowNumber) && (i < columnNumber); i++)
        {
            //alert("1board[" + i + "][" + (i + j) + "]");
            if ((board[i][i + j] == board[i + 1][i + j + 1]) && (board[i][i + j] != null))
            {
                // streak continues
                adjacentSpace++;
            }
            else
            {
                // streak is broken, reset to 1 in a "row" (diagonal)
                adjacentSpace = 1;
            }

            // the game is won if there are 4 
            // or more in a "row" (diagonal)
            if (adjacentSpace >= 4)
            {
                return board[i][i + j];
            }
        }
    }

    // Starting from the upper left corner, 
    // try to find matches in a downwards right
    // diagonal pattern.
    // Then, start from just to the right of the 
    // upper left corner. Repeat until a 
    // match is found, or until there is an
    // attempt to start at the upper right corner.

    // column by column
    for (var j = 0; j < columnNumber; j++)
    {
        adjacentSpace = 1;
        // move diagonally down and right from the top left corner, 
        // then offset to the right by j and repeat, 
        for (var i = 0; (i < rowNumber) && ((i + j) < (columnNumber - 1)); i++)
        {
            //alert("2board[" + (i + j) + "][" + i + "]");
            if ((board[i + j][i] == board[i + j + 1][i + 1]) && (board[i + j][i] != null))
            {
                // streak continues
                adjacentSpace++;
            }
            else
            {
                // streak is broken, reset to 1 in a "row" (diagonal)
                adjacentSpace = 1;
            }

            // the game is won if there are 4 
            // or more in a "row" (diagonal)
            if (adjacentSpace >= 4)
            {
                return board[i + j][i];
            }
        }
    }

    // Starting from the upper right corner, 
    // try to find matches in a downwards left
    // diagonal pattern.
    // Then, start from just below the 
    // upper right corner. Repeat until a 
    // match is found, or until there is an
    // attempt to start at the bottom right corner.

    //row by row
    for (var j = 0; j < rowNumber; j++)
    {
        adjacentSpace = 1;
        // for each row, start right, then move diagonally down and left
        for (var i = 0; ((i + j) < rowNumber) && (i < columnNumber); i++)
        {
            //alert("3board[" + ((columnNumber - 1 - i)) + "][" + (i + j) + "]");
            // Although i is iterating from 0, the calculation "(columnNumber - 1 - i)" 
            // models the behavior of i starting at the last column and decrementing. 
            // This may seem confusing/counterintuitive, but it is there for consistency 
            // with the previous loops and to simplify the arithmetic (such as using [i + j] 
            // to determine the row).
            if ((board[(columnNumber - 1 - i)][i + j] == board[(columnNumber - 1 - i) - 1][i + j + 1]) 
                && (board[(columnNumber - 1 - i)][i + j] != null))
            {
                // streak continues
                adjacentSpace++;
            }
            else
            {
                // streak is broken, reset to 1 in a "row" (diagonal)
                adjacentSpace = 1;
            }

            // the game is won if there are 4 
            // or more in a "row" (diagonal)
            if (adjacentSpace >= 4)
            {
                return board[(columnNumber - 1 - i)][i + j];
            }
        }
    }

    // Starting from the upper right corner, 
    // try to find matches in a downwards left
    // diagonal pattern.
    // Then, start from just to the left of the 
    // upper right corner. Repeat until a 
    // match is found, or until there is an
    // attempt to start at the upper left corner.

    // column by column
    for (var j = 0; j < columnNumber; j++)
    {
        adjacentSpace = 1;
        // move diagonally down and left from the top right corner, 
        // then offset to the left by j and repeat, 
        for (var i = 0; (i < rowNumber) && ((i + j) < (columnNumber - 1)); i++)
        {
            //alert("4board[" + ((columnNumber - 1 - i) - j) + "][" + i + "]");
            // Although i is iterating from 0, the calculation "(columnNumber - 1 - i)" 
            // models the behavior of i starting at the last column and decrementing. 
            // This may seem confusing/counterintuitive, but it is there for consistency 
            // with the previous loops.
            if ((board[(columnNumber - 1 - i) - j][i] == board[(columnNumber - 1 - i) - j - 1][i + 1]) 
                && (board[(columnNumber - 1 - i) - j][i] != null))
            {
                // streak continues
                adjacentSpace++;
            }
            else
            {
                // streak is broken, reset to 1 in a "row" (diagonal)
                adjacentSpace = 1;
            }
            //alert("made it");

            // the game is won if there are 4 
            // or more in a "row" (diagonal)
            if (adjacentSpace >= 4)
            {
                return board[(columnNumber - 1 - i) - j][i];
            }
        }
    }

    return;
}

// returns true if the board is full, otherwise 
// returns false
function boardFullCheck()
{
    //alert("boardFullCheck");
    // column by column
    for (var i = 0; i < columnNumber; i++)
    {
        // row by row
        for (var j = 0; j < rowNumber; j++)
        {
            if (board[i][j] == null)
            {
                return false;
            }
        }
    }
    
    return true;
}



// the gameflow for each round
function GameRound(col){
    socket.emit('pchoice',col);
    if (isSinglePlayer && (playerTurn == 2))
    {
        while (!dropPiece(Math.floor(Math.random() * columnNumber), playerTurn))
        {
            // "AI" repeats selections until a valid one is made.
        }
    } else {
        dropPiece(col, playerTurn);
    }
    isGameOver = gameOverCheck();
    socket.emit('gameOverCheck');

    if(!isGameOver){
    

        if(playerTurn == 1)
        {
            playerTurn = 2;
        }
        else
        {
            if(playerTurn == 2)
            {
                playerTurn = 1;
            }
        }  

        socket.emit('nextTurn', playerTurn);

        if(isSinglePlayer && playerTurn==2){
            GameRound();
        }
    }
}

// highlights column when hovered over
function highlightColumn(classname){
    var col = document.getElementsByClassName(classname);
    var n = col.length;
    var color;
    for (var i = 0; i<n; i++){
        col[i].setAttribute("oldcolor",col[i].style.backgroundColor);
        if (playerTurn == 1){          
        col[i].style.backgroundColor = "indianred";
        } else{
        col[i].style.backgroundColor = "lightblue";
        }
    }

}

// removes highlight 
function remHighlight(classname){
    var col = document.getElementsByClassName(classname);
    var n = col.length;
    for (var i = 0; i<n; i++){
        col[i].style.backgroundColor = col[i].getAttribute("oldcolor");
    }

}

// changes between single and multiplayer depending on button press
function PlayerSelection(button){
    if(button.value == "1"){
        isSinglePlayer = true;
    }
    //sends choice to server
    socket.emit('singleplayer?', singleplayer);

    document.getElementById("oneplayer").disabled = true;
    document.getElementById("twoplayer").disabled = true;
	document.getElementById("button").disabled = true;

}

// shows winner
function showWinner(winner){
    if (winner == "tie"){
        document.getElementById("whowins").innerHTML = "It is a tie!"
    } else {
        document.getElementById("whowins").innerHTML = "Player "+ winner + " has won the game!";
    }
    document.body.style.backgroundColor = "gray";
    document.getElementById("alertrem").style.display = "block";


}

// resets board
function reset(){
    socket.emit('reset');
}

// displays instructions when hovered over
function InstructionHover(game){
    if(game == 'TicTacToe'){
        document.getElementById("instructions").innerHTML = "Select a column to place your color.<br> Four in a row in any direction and you win! <br> First Player starts as <b> Red</b><br>And Second Player as <b> Blue</b>";
    }
    if(game == 'remove'){
        document.getElementById("instructions").innerHTML = "Hover here for instructions";
    }
}
