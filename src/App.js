import React, { Component } from 'react';
//import types from 'prop-types';
import './App.css';
import ColorButtonGrid from './ColorButtonGrid';

const MODES = {
  SIMON: 0,
  PLAYER: 1,
  OFF: 2,
  GAME_OVER: 3
};

const PLAYER_INPUT_TIMEOUT = 5000;
const SIMON_COLOR_DURATION = 1000;
const SIMON_PAUSE_DURATION = 500;

class SimonSaysGame extends Component{

  state = {
    mode: MODES.OFF,
    simonSequence: [],
    isSimonBetweenColors: false,
    currentIndex: 0,
    gameOverReason: null
  };

  componentDidUpdate(){
    const {mode} = this.state;

    if(mode === MODES.SIMON){
      this.prepareNextSimonAction();
    }
    if(mode === MODES.PLAYER){
      this.resetPlayerTimeout();
    }
  }

  prepareNextSimonAction = () => {
    const {isSimonBetweenColors, currentIndex} = this.state;

    clearTimeout(this.simonTimeout);

    if(isSimonBetweenColors){
      this.simonTimeout = setTimeout(() => {
        this.setState({
          isSimonBetweenColors: false,
          currentIndex: currentIndex + 1
        });
      }, SIMON_PAUSE_DURATION);
    }else{
      this.simonTimeout = setTimeout(() => {
        const {simonSequence, currentIndex} = this.state;
        if( currentIndex + 1 >= simonSequence.length){
          console.log('SEQUENCE OVER - PLAYERS TURN');
          this.startPlayersTurn();
        }else{
          this.setState({
            isSimonBetweenColors: true
          });
        }
      }, SIMON_COLOR_DURATION);
    }
  }

  startSimonTurn = () => {
    const {simonSequence} = this.state;
    this.setState({
      mode: MODES.SIMON,
      simonSequence: simonSequence.concat([this.randomNextColor()]),
      currentIndex: 0,
      isSimonBetweenColors: false
    });
  };

  startPlayersTurn = () => {
    this.setState({
      mode: MODES.PLAYER,
      currentIndex: 0,
      isSimonBetweenColors: false
    });
  }

  resetPlayerTimeout = () => {
    clearTimeout(this.playerTimeout);
    this.playerTimeout = setTimeout(() => {
      console.log('GAME OVER - TIMED OUT');
      this.endGame('Too slow.');
    }, PLAYER_INPUT_TIMEOUT);
  };

  endGame = (reason) => {
    clearTimeout(this.playerTimeout);
    this.setState({
      mode: MODES.GAME_OVER,
      gameOverReason: reason
    });
  };

  processPlayerColor = (n) => {
    const {mode, simonSequence, currentIndex} = this.state;
    if(mode !== MODES.PLAYER) return;

    clearTimeout(this.playerTimeout);

    if(n !== simonSequence[currentIndex]){
      console.log('INCORRECT COLOR');
      this.endGame('Incorrect color.');
      return;
    }

    if(currentIndex + 1 >= simonSequence.length){
      console.log('CORRECT SEQUENCE - BACK TO SIMON');
      this.startSimonTurn();
      return;
    }

    console.log('CORRECT COLOR - KEEP GOING');
    this.setState({
      currentIndex: currentIndex + 1
    });
  };

  startGame = () => {
    console.log('START GAME');
    this.setState({
      mode: MODES.SIMON,
      simonSequence: [this.randomNextColor()],
      currentIndex: 0,
      isSimonBetweenColors: false
    });
  };

  randomNextColor = () => {
    return Math.floor(Math.random()*4);
  };

  render(){
    const {simonSequence, mode, isSimonBetweenColors, gameOverReason, currentIndex} = this.state;
    const score = simonSequence.length ? simonSequence.length - 1 : 0;

    return (
      <div>
        <p>
          {mode === MODES.OFF && (<button onClick={this.startGame}>Start Game</button>)}
          {mode === MODES.SIMON && ("Simon's Turn")}
          {mode === MODES.PLAYER && ("Your Turn")}
          {mode === MODES.GAME_OVER && ([
            <span key='reason'>{gameOverReason}</span>,
            <span style={{marginRight:'1em'}} key='space'/>,
            <button onClick={this.startGame} key='restart'>Restart</button>
          ])}
        </p>
        <br />
        <ColorButtonGrid {...{
          currentOn: mode === MODES.SIMON && !isSimonBetweenColors && simonSequence[currentIndex],
          clickable: mode === MODES.PLAYER,
          onPlayerSelectColor: this.processPlayerColor,
        }} />
        <br />
        <p>Score: {score}</p>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Simon Says</h1>
        </header>
        <SimonSaysGame />
      </div>
    );
  }
}

export default App;
