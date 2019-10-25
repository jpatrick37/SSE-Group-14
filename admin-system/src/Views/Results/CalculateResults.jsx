import React, { Component } from 'react';
import NavBar from '../NavBar.jsx';
import { Header, Button, Modal, Icon } from 'semantic-ui-react'
import { IoLogoBuffer, IoMdSad } from 'react-icons/io'

import LoadingBar from 'react-top-loading-bar'

import {getElectionTime, convertStringToDate} from '../../Functions/ElectionDetails'

import LoadingSymbol from './../LoadingSymbol'

class CalculateResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loadingBarProgress: 50,
        startTime: "",
        endTime: "",
        fetchingTime: true,
        warningOpen: false,
    };
  }

  async componentDidMount(){
    getElectionTime().then(result => {
      let time = result['message']
      this.setState({
        startTime: time['startTime'],
        endTime: time['endTime'],
        fetchingTime: false
      })
    })
  }

  complete = () => {
    this.setState({ loadingBarProgress: 100 })
  }

  onLoaderFinished = () => {
    this.setState({ loadingBarProgress: 0 })
  }

  // opens the prompt for editting
  openWarningMessage = () => {
    this.setState({ warningOpen: true });
  }
  
  isCurrenttimeAfter = (time) => {
    // ideally might want an api call to a time server(get curent time)
    let currentTime = new Date().getTime();
    console.log("Times")
    console.log(currentTime)
    console.log(time)
    // if the current time is after the election, they can calucate the results
    if(currentTime > time){
      return true
    }
    return false
  }

  calculateResults = (value) => {
    if(value){
      // if the election is over
      if(this.isCurrenttimeAfter(convertStringToDate(this.state.endTime))){
        console.log("can count")
      }
      else{
        console.log("can't count")
      }
      this.setState({warningOpen: false, loadingBarProgress: 100})
    }
    else{
      this.setState({warningOpen: false})
    }
  }

  render() {
    // if havn't fetched time display loading bar
    if(this.state.fetchingTime){
      return <LoadingSymbol {...this.props} activeItem='results' />
    }
    if (!this.isCurrenttimeAfter(convertStringToDate(this.state.endTime))){
      return(
        <div style= {{width: "100%"}}>
          <NavBar {...this.props} activeItem='results' />
          <Header as='h1'>The Election is not over yet! </Header>
          <IoMdSad size="10em"/> <br />
        </div>
      )
    }
    return (
      <div style= {{width: "100%"}}>
        <NavBar {...this.props} activeItem='results' />
        <IoLogoBuffer size="10em"/> <br />
        <Button color='red' onClick={this.openWarningMessage}>Claculate Results</Button>
        <LoadingBar
          progress={this.state.loadingBarProgress}
          height={3}
          color="rgb(0,191, 255)"
          onLoaderFinished={() => this.onLoaderFinished()}
        />


        {/* warning pop up shown if they want to claculate results */}
        <Modal open={this.state.warningOpen}  basic size='small'>
              <Header icon='archive' content='Counting the Votes' />
              <Modal.Content>
                <p>
                  You are about to calculate the results of the election. Are you sure?
                </p>
              </Modal.Content>
              <Modal.Actions>
                <Button basic color='grey' inverted onClick={() => this.calculateResults(false)}>
                  <Icon name='remove' /> No
                </Button>
                <Button color='red' inverted onClick={() => this.calculateResults(true)}>
                  <Icon name='checkmark' /> Yes
                </Button>
              </Modal.Actions>
            </Modal>
      </div>
    )
  }
}


export default CalculateResults;
