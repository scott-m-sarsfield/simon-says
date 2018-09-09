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
    onClick: types.func.isRequired,
    clickable: types.bool.isRequired
  };

  state = {
    responsiveOn: false
  }

  handleMouseDown = () => {
    const {clickable, onClick} = this.props;
    if(clickable){
      this.setState({
        responsiveOn: true
      });
      onClick();
    }
  };

  handleMouseUp = () => {
    this.setState({
      responsiveOn: false
    });
  };

  render(){
    const {color, on} = this.props;
    const {responsiveOn} = this.state;

    const styles = {
      height: 200,
      width: 200,
      display: 'inline-block',
      backgroundColor: color,
      border: '4px solid white',
      position: 'relative'
    };
    return (
      <div style={styles} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
        {(on || responsiveOn) && (
          <OnIndicator />
        )}
      </div>
    )
  }
}

class ColorButtonGrid extends Component{
  render(){
    const {currentOn, onPlayerSelectColor, clickable} = this.props;

    const [GREEN,RED,YELLOW,BLUE] = ['green','red','#dd0','blue'].map( (color, index) => ({color, index}) );

    const renderButton = ({color,index}) => (
      <ColorButton {...{
        color,
        on: currentOn === index,
        onClick: () => { onPlayerSelectColor(index); },
        clickable
      }} />
    )

    return (
      <div>
        {renderButton(GREEN)}
        {renderButton(RED)}
        <br />
        {renderButton(BLUE)}
        {renderButton(YELLOW)}
      </div>
    );
  }
}

export default ColorButtonGrid;
