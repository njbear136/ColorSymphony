import React from 'react';
import ColorCanvas from './ColorCanvas';
import './App.css';

export default function App(){
  return(
    <div className="app-background">
      <div className= "app-wrap">
        <header className="header">
          <h1>🎶Color Symphony🎶</h1>
          <p className= "lead">Draw with your mouse or touch.</p>
        </header>

      <ColorCanvas />

      <div style={{marginTop:18}}>
        <small> Tip: Click or drag on the canvas to draw.</small></div>
        <div>Disclaimer: Only these colors play different songs when used: pink, red, green, dark blue, sky blue, purple.</div>
        <div>Pink: My love mine all mine by Mitski</div>
        <div>Red: Can't help falling in love by Elvis Presley</div>
        <div>Green: Green Tea & Honey by Dane Amar and Jereena Montemayor</div>
        <div>Dark Blue: Blue by yung kai, feat. MINNIE</div>
        <div>Sky Blue: Ocean View by Dept, feat. Kelsey Kuan and prettyhappy</div>
        <div>Purple: Surfing in the Moonlight by TOMORROW X TOGETHER</div>
        <div><small>The other colors play one default song:D | Hitori no Yoru by TOMORROW X TOGETHER</small></div>
    </div>
    </div>
  );
}