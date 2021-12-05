/*
Michael Raffel
9/16/21

Tic Tac Toe prototype that utilizes simple html commands 
(alert, prompt) to showcase the logic of the game before it 
is implemented properly via css/html.
Supports local play where two players take turns at the computer 
choosing spaces (referred to as 0-8).
*/

// representation of the spaces on the board, labeled 0-8
var board = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
// stores which player's turn it is (alternates between X and O)
var playerTurn = "O";
// ends the game loop when isGameOver = true
var isGameOver = false;
// the game is played again if isPlayingAgain = true
var isPlayingAgain;
var singleplayer = false;
var retry;






// Checks to see if any players have won the game, 
// then calls boardFullCheck() to see if the board is full.
// If either condition is fullfilled, it returns true, 
// signifying that the game is over.
function gameOverCheck()
{
        
    
    // checks if either player has three consecutive spaces in a COLUMN
    for (i = 0; i < 3; i++)
    {
        if ( (board[i] == board[i + 3]) && (board[i] == board[i + 6]) && (board[i] != " ") )
        {
            showWinner(playerTurn);
            isGameOver = true;
			disable();
        }
    }

    // checks if either player has three consecutive spaces in a ROW
    for (i = 0; i < 7; i = i + 3)
    {
        if ( (board[i] == board[i + 1]) && (board[i] == board[i + 2]) && (board[i] != " ") )
        {
            showWinner(playerTurn);
            isGameOver = true;
			disable();
        }
    }

    //checks if either player has three consecutive spaces diagonally
    if ( (board[0] == board[4]) && (board[0] == board[8]) && (board[0] != " ") )
    {
        showWinner(playerTurn);
        isGameOver = true;
		disable();
    }
    else if ( (board[2] == board[4]) && (board[2] == board[6]) && (board[2] != " ") )
    {
        showWinner(playerTurn);
        isGameOver = true;
		disable();
    }
	else
	{
    boardFullCheck();
	}
}


// Checks to see if the board is full, resulting in a tie. 
// If there are no more blank spaces, returns true, otherwise 
// returns false.
function boardFullCheck()
{
    let isBoardFull = true;
    for (i = 0; i < 9; i++)
    {
        if (board[i] == " ")
        {
            isBoardFull = false;
        }
    }

    if (isBoardFull)
    {
        showWinner("tie");
        isGameOver = true;
		disable();
    }
}
function fillSpace(space)
{
		//If player "X" just went, switch to player "O"
		//and vice versa
		if(playerTurn == "X")
        {
            playerTurn = "O";
        }
        else
        {

            playerTurn = "X";
            
        }
	

	if (board[space] == " ")
	{
	board[space] = playerTurn;
	switch(space)
	{
		case 0:
			document.getElementById("b1").value = playerTurn;
			break;
		case 1:
			document.getElementById("b2").value = playerTurn;
			break;
		case 2:
			document.getElementById("b3").value = playerTurn;
			break;
		case 3:
			document.getElementById("b4").value = playerTurn;
			break;
		case 4:
			document.getElementById("b5").value = playerTurn;
			break;
		case 5:
			document.getElementById("b6").value = playerTurn;
			break;
		case 6:
			document.getElementById("b7").value = playerTurn;
			break;
		case 7:
			document.getElementById("b8").value = playerTurn;
			break;
		case 8:
			document.getElementById("b9").value = playerTurn;
			break;
	}
	}
	else
	{
		alert("please pick a space that is blank!");
        retry = true;
	} 

}
function disable()
{
	document.getElementById("b1").disabled = true;
    document.getElementById("b2").disabled = true;
    document.getElementById("b3").disabled = true;
	document.getElementById("b4").disabled = true;
    document.getElementById("b5").disabled = true;
    document.getElementById("b6").disabled = true;
    document.getElementById("b7").disabled = true;
    document.getElementById("b8").disabled = true;
    document.getElementById("b9").disabled = true;
}

function reset()
{
	location.reload();
	
}

function InstructionHover(game){
    if(game == 'TicTacToe'){
        document.getElementById("instructions").innerHTML = "Game starts by just tapping on one of the box <br> First Player starts as <b>Player X</b><br>And Second Player as <b>Player O</b>";
    }
    if(game == 'remove'){
        document.getElementById("instructions").innerHTML = "Hover here for instructions";
    }
}

/*
Brayden Lappies
9/21/21

Tic Tac Toe AI for single player prototype that utilizes functions
from TicTacToe2.js as a base with some differences made for singleplayer.
Supports solo play where one players takes turns against the computer 
choosing spaces (as of currently, at random). Computer will always be
Player O.
*/

//AI engine
//Place an O in an open spot at random
function AIPlace()
{
    //Keeps running until the AI sucessfully places an O
    var placed = false;
    //Spot the AI will attempt to place an O
    var spot;
    spot = AIWinCheck();
    
    if (spot != -1)
    {
       board[spot] == "O";
       fillSpace(spot);
        placed = true;
        return;
        
    }
    spot = AILoseCheck();
    
    if (spot != -1)
    {
       board[spot] == "O";
       fillSpace(spot);
        placed = true;
    }
    while (!placed)
    {
        //generate a number 0-8
        spot = Math.floor(Math.random() * 9);
        if (board[spot] == " ")
        {
            board[spot] == "O";
            fillSpace(spot);
            placed = true;
            
        }
    }
}

//Check to see if the AI has a win condition available
function AIWinCheck()
{

    //check for a win conditional in rows
    for (i = 0; i < 7; i = i + 3)
    {
        if ( (board[i] == board[i+1]) && (board[i] == "O") && (board[i+2] == " ") )
            return i+2;
        else if ( (board[i] == board[i + 2]) && (board[i] == "O") && (board[i+1] == " ") )
            return i+1;
        else if ( (board[i+1] == board[i+2]) && (board[i+1] == "O") && (board[i] == " ") )
            return i;
        else
            continue;
    }
    //check for a win condition in columns
    for (i = 0; i < 3; i++)
    {
        if ( (board[i] == board[i+3]) && (board[i] == "O") && (board[i+6] == " ") )
            return i+6;
        else if ( (board[i] == board[i+6]) && (board[i] == "O") && (board[i+3] == " ") )
            return i+3;
        else if ( (board[i+3] == board[i+6]) && (board[i+3] == "O") && (board[i] == " ") )
            return i;
        else
            continue;
    }
    //check for a win condition on diagonal 1 (0 4 and 8) and diagonal 2 (2, 4, 6)
    if ( (board[0] == board[4]) && (board[0] == "O") && (board[8] == " ") )
        return 8;
    else if ( (board[0] == board[8]) && (board[0] == "O") && (board[4] == " ") )
        return 4;
    else if ( (board[4] == board[8]) && (board[4] == "O") && (board[0] == " ") )
        return 0;
    else if ( (board[2] == board[6]) && (board[2] == "O") && (board[6] == " ") )
        return 6;
    else if ( (board[2] == board[6]) && (board[2] == "O") && (board[4] == " ") )
        return 4;
    else if ( (board[4] == board[6]) && (board[4] == "O") && (board[2] == " ") )
        return 2;
    else
        return -1;
    //-1 denotes it did not find a win condition
}

//AI checks if it might lose and attmeptes to block the loss
function AILoseCheck()
{
    //check for a lose conditional in rows
    for (i = 0; i < 7; i = i + 3)
    {
        if ( (board[i] == board[i+1]) && (board[i] == "X") && (board[i+2] == " ") )
            return i+2;
        else if ( (board[i] == board[i + 2]) && (board[i] == "X") && (board[i+1] == " ") )
            return i+1;
        else if ( (board[i+1] == board[i+2]) && (board[i+1] == "X") && (board[i] == " ") )
            return i;
        else
            continue;
    }
    //check for a win condition in columns
    for (i = 0; i < 3; i++)
    {
        if ( (board[i] == board[i+3]) && (board[i] == "X") && (board[i+6] == " ") )
            return i+6;
        else if ( (board[i] == board[i+6]) && (board[i] == "X") && (board[i+3] == " ") )
            return i+3;
        else if ( (board[i+3] == board[i+6]) && (board[i+3] == "X") && (board[i] == " ") )
            return i;
        else
            continue;
    }
    //check for a win condition on diagonal 1 (0 4 and 8) and diagonal 2 (2, 4, 6)
    if ( (board[0] == board[4]) && (board[0] == "X") && (board[8] == " ") )
        return 8;
    else if ( (board[0] == board[8]) && (board[0] == "X") && (board[4] == " ") )
        return 4;
    else if ( (board[4] == board[8]) && (board[4] == "X") && (board[0] == " ") )
        return 0;
    else if ( (board[2] == board[6]) && (board[2] == "X") && (board[6] == " ") )
        return 6;
    else if ( (board[2] == board[6]) && (board[2] == "X") && (board[4] == " ") )
        return 4;
    else if ( (board[4] == board[6]) && (board[4] == "X") && (board[2] == " ") )
        return 2;
    else
        return -1;
    //-1 denotes it did not find a win condition
}

function PlayerSelection(button){
    if(button.value == "1"){
        singleplayer = true;
    }
    document.getElementById("oneplayer").disabled = true;
    document.getElementById("twoplayer").disabled = true;
	document.getElementById("button").disabled = true;
}


function GameRound(spot){
    fillSpace(spot);
    if (retry){
        if(playerTurn == "X")
        {
            playerTurn = "O";
        }
        else
        {
            playerTurn = "X";
        } 
        retry = false;
        console.log("retry is "+ retry);
        return;
    }
    gameOverCheck();
    if (!isGameOver && singleplayer){
        AIPlace();
        gameOverCheck();
    }
    
}

function showWinner(winner){
    if (winner == "tie"){
        document.getElementById("whowins").innerHTML = "It is a tie!"
    } else {
        document.getElementById("whowins").innerHTML = winner + " has won the game!";
    }
    document.body.style.backgroundColor = "gray";
    document.getElementById("alertrem").style.display = "block";


}
