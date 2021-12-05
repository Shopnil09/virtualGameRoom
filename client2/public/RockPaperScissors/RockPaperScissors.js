
var playerOneChoice;
var playerTwoChoice;
var singleplayer= false;
var playerTurn = 1;

function RPSRound(x){
    document.getElementById("oneplayer").disabled = true;
    document.getElementById("twoplayer").disabled = true;
    makeSelection(x);
    if (singleplayer){
        AI_RPS();
    }
    if (playerTurn>2){
    RPSWinCheck();
    }
    

}

function makeSelection(choice){
    if (playerTurn == 1){
        playerOneChoice = choice;
    } else {
        playerTwoChoice = choice;
    }
    playerTurn ++;
}
function RPSWinCheck(){
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

function PlayerSelection(button){
    if(button.value == "1"){
        singleplayer = true;
    } else {
        singleplayer = false;
    }
    document.getElementById("oneplayer").disabled = true;
    document.getElementById("twoplayer").disabled = true;
	document.getElementById("button").disabled = true;

}

function AI_RPS(){
    var aiselect = Math.floor(Math.random() * 3);

    if (aiselect == 0){
        makeSelection("rock");
        alert("The AI has picked rock");
        } else if (aiselect == 1){
        makeSelection("scissors");
        alert("The AI has picked scissors");
    } else {
        makeSelection("paper");
        alert("The AI has picked paper");
    }
    console.log(aiselect);

}

