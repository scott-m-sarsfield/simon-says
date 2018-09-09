import React, { Component } from 'react';
import types from 'prop-types';
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

const withPropQueue = (Wrapped) => {
  return class PropQueued extends Component{

    state = {
      propQueue: []
    };

    componentDidMount(){
      const {propQueue} = this.props;
      this.setState({
        propQueue
      });
    }

    componentWillReceiveProps({propQueue}){
      if(this.props.propQueue !== propQueue){
        this.setState({
          propQueue
        });
      }
    }

    componentDidUpdate(){
      const currentQueuedProps = this.state.propQueue[0];
      if(currentQueuedProps){
        this.timeout = setTimeout(() => {
          let remaining = this.state.propQueue.slice(1);
          this.setState({
            propQueue: remaining
          });
          if(remaining.length === 0) this.props.onQueueEnd();
        }, currentQueuedProps.duration);
      }
    }

    render(){
      const {onQueueEnd, ...others} = this.props;
      const {propQueue} = this.state;
      delete others.propQueue;

      let queuedProps = (propQueue[0] || {}).props;
      return (
        <Wrapped {...{
          ...others,
          ...queuedProps
        }} />
      )
    }
  }
}

const QueuedColorButtonGrid = withPropQueue(ColorButtonGrid);

class SequencedColorButtonGrid extends Component{

  static propTypes = {
    sequence: types.array.isRequired
  }

  makePropQueue = (sequence) => {
    if(!sequence || !sequence[0]) return [];
    const pause = {
      props:{
        currentOn: null
      },
      duration: SIMON_PAUSE_DURATION
    };

    const showColor = (color) => ({
      props:{
        currentOn: color
      },
      duration: SIMON_COLOR_DURATION
    })

    return sequence.slice(1).reduce(
      (q, color) => {
        return q.concat([
          pause,
          showColor(color)
        ]);
      },
      [showColor(sequence[0])]
    );
  }

  render(){
    const {sequence} = this.props;

    return (
      <QueuedColorButtonGrid
        {...this.props}
        propQueue={this.makePropQueue(sequence)}
      />
    );
  }
}

const NO_SEQUENCE = [];


class SimonSaysGame extends Component{

  state = {
    mode: MODES.OFF,
    simonSequence: [],
    currentIndex: 0,
    gameOverReason: null
  };

  componentDidUpdate(){
    const {mode} = this.state;

    if(mode === MODES.PLAYER){
      this.resetPlayerTimeout();
    }
  }

  startSimonTurn = () => {
    const {simonSequence} = this.state;
    this.setState({
      mode: MODES.SIMON,
      simonSequence: simonSequence.concat([this.randomNextColor()])
    });
  };

  startPlayersTurn = () => {
    this.setState({
      mode: MODES.PLAYER,
      currentIndex: 0
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
      simonSequence: [this.randomNextColor()]
    });
  };

  randomNextColor = () => {
    return Math.floor(Math.random()*4);
  };

  render(){
    const {simonSequence, mode, gameOverReason} = this.state;
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
        <SequencedColorButtonGrid {...{
          clickable: mode === MODES.PLAYER,
          onPlayerSelectColor: this.processPlayerColor,
          sequence: (mode === MODES.SIMON && simonSequence) || NO_SEQUENCE,
          onQueueEnd:() => {
            if(mode === MODES.SIMON){
              this.startPlayersTurn();
            }
          }
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
