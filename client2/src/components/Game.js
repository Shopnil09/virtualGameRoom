import React from 'react';
import '../cssStyles/royalflushbackground.css'; 

export default function Game() {
    return (
        <div className="container">
            <div className="title">
                <h1>
                    <u>
                        Royal Flush
                    </u>
                </h1>
            </div>
            <div className="select">
                <h2>
                    Select Game
                </h2>
            </div>
            <div className="space">
                <p>
                    <br>
                    </br>
                </p>
            </div>
            <div className="games" onclick="window.open('TicTacToe_page.html','_self');">
                <h3>
                    TicTacToe
                </h3>
            </div>
            <div className="space">
                <p>
                </p>
            </div>
            <div className="games" onclick="window.open('Rock Paper Scissors update/Rock_Paper__Scissors.html','_self');">
                <h4>
                    Rock, Paper, Scissors
                </h4>
            </div>
            <div className="space">
                <p>
                </p>
            </div>
            <div className="games" onclick="window.open('ConnectFour.html','_self');">
                <h4>
                    Connect Four
                </h4>
            </div>
        </div>
    )
}