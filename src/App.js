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
    on: types.bool.isRequired
  };

  render(){
    const {color, on} = this.props;

    const styles = {
      height: 200,
      width: 200,
      display: 'inline-block',
      backgroundColor: color,
      border: '4px solid white',
      position: 'relative'
    };
    return (
      <div style={styles}>
        {on && (
          <OnIndicator />
        )}
      </div>
    )
  }
}

class SimonSaysGame extends Component{

  state = {
    currentOn: 0
  };

  componentDidMount(){
    this.timer = setInterval(() => {
      this.setOn(
        (this.state.currentOn + 1) % 4
      );
    }, 1000);
  }


  setOn(n){
    this.setState({
      currentOn: n
    });
  }

  render(){
    const {currentOn} = this.state;
    return (
      <div>
        <ColorButton color='green' on={currentOn === 0}/>
        <ColorButton color='red' on={currentOn === 1}/>
        <br />
        <ColorButton color='blue' on={currentOn === 3}/>
        <ColorButton color='#dd1' on={currentOn === 2}/>
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
