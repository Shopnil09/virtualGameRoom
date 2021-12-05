import React from 'react';
import '../cssStyles/royalflushbackground.css'; 
import "../cssStyles/fonts.css";
import Navbar from './Navbar/Navbar';
import GameCard from './GameCard';

export default function Game() {
    return (
        <div className="Game">
        <Navbar/>
        <GameCard/>
        </div>
        
    )
}