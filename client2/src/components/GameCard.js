import React from 'react';
import { Link } from 'react-router'
import { GameList } from './GameList';
import './GameList.css';


function GameCard(props) {
    return (
        <div className="gamelist" >
            {GameList.map((item, index)=> {
                        return (
                            <li key ={index}>
                                <br />
                                <a className={item.cName} href={item.url}>
                                {item.title}
                                </a>
                                <br></br>
                                <br />
                            </li>

                        )
                    })}
        </div>
    )
}



export default GameCard;
