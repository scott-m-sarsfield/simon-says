import React, { Component } from 'react';
import types from 'prop-types';
import './App.css';

class OnIndicator extends Component{
  render(){
    const wrapperStyles = {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      overflow: 'hidden'
    };

    const innerStyles = {
      position: 'absolute',
      left: 0,
      right: 0,
      margin: 'auto',
      boxShadow: '0px 0px 200px 100px white',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'white',
      width: 1,
      borderRadius: '50%',
    };

    return (
      <div style={wrapperStyles}>
        <div style={innerStyles}/>
      </div>
    )
  }
}

class ColorButton extends Component{
  static propTypes = {
    color: types.string.isRequired,
    on: types.bool.isRequired,
    onClick: types.func.isRequired
  };

  render(){
    const {color, on, onClick} = this.props;

    const styles = {
      height: 200,
      width: 200,
      display: 'inline-block',
      backgroundColor: color,
      border: '4px solid white',
      position: 'relative'
    };
    return (
      <div style={styles} onClick={onClick}>
        {on && (
          <OnIndicator />
        )}
      </div>
    )
  }
}

const MODES = {
  SIMON: 0,
  PLAYER: 1,
  OFF: 2,
  GAME_OVER: 3
};

class SimonSaysGame extends Component{

  state = {
    mode: MODES.OFF,
    simonSequence: [],
    inSimonPause: false,
    currentIndex: 0,
    gameOverReason: null
  };

  componentDidUpdate(){
    const {mode, inSimonPause} = this.state;
    if(mode === MODES.SIMON){
      if(inSimonPause){
        this.timeout = setTimeout(this.showNextColorOrPlayersTurn, 500);
      }else{
        this.timeout = setTimeout(() => {
          this.setState({
            inSimonPause: true
          });
        }, 1000)
      }
    }
    if(mode === MODES.PLAYER){
      this.timeout = setTimeout(() => {
        console.log('GAME OVER - TIMED OUT');
        this.setState({
          mode: MODES.GAME_OVER,
          gameOverReason: 'Too slow.'
        });
      }, 5000);
    }
  }

  showNextColorOrPlayersTurn = () => {
    const {simonSequence, currentIndex} = this.state;
    if( currentIndex + 1 >= simonSequence.length){
      console.log('SEQUENCE OVER - PLAYERS TURN');
      this.setState({
        mode: MODES.PLAYER,
        currentIndex: 0,
        isSimonPause: false
      });
    }else{
      this.setState({
        currentIndex: currentIndex + 1,
        inSimonPause: false
      });
    }
  }

  setOn = (n) => {
    this.setState({
      currentOn: n
    });
  };

  processPlayerColor = (n) => {
    const {mode, simonSequence, currentIndex} = this.state;
    if(mode !== MODES.PLAYER) return;

    clearTimeout(this.timeout);

    if(n !== simonSequence[currentIndex]){
      console.log(n, simonSequence, currentIndex);
      console.log('INCORRECT COLOR');
      this.setState({
        mode: MODES.GAME_OVER,
        gameOverReason: 'Incorrect color.'
      });
    }

    if(currentIndex + 1 >= simonSequence.length){
      console.log('CORRECT SEQUENCE - BACK TO SIMON');
      this.setState({
        mode: MODES.SIMON,
        simonSequence: simonSequence.concat([this.randomNextColor()]),
        currentIndex: 0,
        inSimonPause: false
      });
    }else{
      console.log('CORRECT COLOR - KEEP GOING');
      this.setState({
        currentIndex: currentIndex + 1
      });
    }
  };

  startGame = () => {
    console.log('START GAME');
    this.setState({
      mode: MODES.SIMON,
      simonSequence: [this.randomNextColor()],
      currentIndex: 0
    });
  };

  randomNextColor = () => {
    return Math.floor(Math.random()*4);
  };

  render(){
    const {simonSequence, mode, currentIndex, gameOverReason, inSimonPause} = this.state;
    const score = simonSequence.length ? simonSequence.length - 1 : 0;

    const currentOn = (mode === MODES.SIMON && !inSimonPause && simonSequence[currentIndex]);

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
        <ColorButton color='green' on={currentOn === 0} onClick={this.processPlayerColor.bind(null,0)}/>
        <ColorButton color='red' on={currentOn === 1} onClick={this.processPlayerColor.bind(null,1)}/>
        <br />
        <ColorButton color='blue' on={currentOn === 3} onClick={this.processPlayerColor.bind(null,3)}/>
        <ColorButton color='#dd1' on={currentOn === 2} onClick={this.processPlayerColor.bind(null,2)}/>
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
