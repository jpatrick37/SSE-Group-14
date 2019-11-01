import React, { Component } from 'react';
import NavBar from './NavBar.jsx';
import ReactLoading from 'react-loading';

// displays a loading symbol
class LoadingSymbol extends Component {
  render() {
    return (
      <div style= {{width: "100%"}}>
        <NavBar {...this.props} activeItem={this.props.activeItem} />
        <ReactLoading type="bubbles" color="blue" height={667} width={375} />
      </div>
    )
  }
}


export default LoadingSymbol;
