import React, { Component } from 'react';
import {DateTimeInput } from 'semantic-ui-calendar-react';
import { Form, Header, Modal, Button, Icon, Message } from 'semantic-ui-react'
import NavBar from '../NavBar.jsx';
import { firebase } from '../../Firebase';

import { getElectionTime, convertStringToDate } from '../../Functions/ElectionDetails'

import LoadingSymbol from './../LoadingSymbol'


// this class allows the admin to view and change the date of the election
class ElectionDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: '',
            endTime: '',
            disabled: true,
            warningOpen: false,
            loading: true,
            submitted: false,
        };
        // refrence to the database
        this.electionCollection = firebase.firestore().collection("electionDetails")
    }

  // runs when the componet first loads
  async componentDidMount(){

    // gets the election times
    getElectionTime().then(result => {
      let time = result['message']
      this.setState({
        startTime: time['startTime'],
        endTime: time['endTime'],
        loading: false})
    })
  }
  
  // runs when the input field start Time changes
  handleChangeStart = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value, submitted: false });
    }
  }

  // runs when the input field end Time changes
  handleChangeEnd = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value, submitted: false });
    }
  }

  isVaildDates(startDate, endDate){
    console.log(startDate)
    console.log(endDate)
    // if start date is bigger than 
    if (startDate < endDate){
      return true
    }
    return false
  }

  // submits the dates to firebase
  submitDates = () => {
    // refrecne to the firebase 'table'
    var timeDetailsRef = this.electionCollection.doc("electionTime");

    // gets the startTime and endTime the user inputted
    let startTime = convertStringToDate(this.state.startTime)
    let endTime = convertStringToDate(this.state.endTime)
    if (!this.isVaildDates(startTime, endTime)){
      console.log("start date is greater than end date")
      return 
    }
    // convert to object
    let object = {startTime: startTime, endTime: endTime}

    // submit object to the 'table'
    timeDetailsRef.set(object).then(doc => {
      console.log("Document uploaded")
      //logging actions
      var logMessage  = "Admin has updated election time";
      console.log(logMessage + " [userId: " + this.props.user.id + ']' );
      firebase.firestore().collection("logs").add({message: logMessage, uid: this.props.user.id, time: new Date()});
      
      this.setState({submitted: true, disabled: true})
    }).catch(function(error) {
      console.log("Error writing document", error)
    })
  }
  
  // sets the diasbled state
  setDisabledState = (value) => {
    console.log(value)
    this.setState({ warningOpen: false, disabled: value });
  }

  // opens the prompt for editting
  openWarningMessage = () => {
    this.setState({ warningOpen: true });
  }

  // returns the start and end time as headers
  renderDates = () => {
    return (
      <div>
        <Header as='h1'>Start Time: {this.state.startTime} UTC+10:30</Header>
        <Header as='h1'>End Time: {this.state.endTime} UTC+10:30</Header>
      </div>
    )
  }

  // retursn the start and end time if the edit is disabled, else reutnr the edit fiels for start and end time
  renderForms = () => {
    if(this.state.disabled){
      return this.renderDates()
    }
    return(
          <div style= {{margin: 'auto',width: "200px"}}>
            <Header large="true">Start Date</Header>
            <Form>
                <DateTimeInput 
                name="startTime"
                placeholder="Date Time"
                value={this.state.startTime}
                iconPosition="left"
                onChange={this.handleChangeStart}
                />
            </Form>
            <Header large="true">End Date</Header>
            <Form>
                <DateTimeInput 
                name="endTime"
                placeholder="Date Time"
                value={this.state.endTime}
                iconPosition="left"
                onChange={this.handleChangeEnd}
                />
            </Form>
            {/* submit button */}
            <Button style={{margin: '10px'}}  onClick={this.submitDates}>Submit</Button>
        </div>
    )
  }
  

  render() {
    // if loading display loading 
    if(this.state.loading){
      return <LoadingSymbol {...this.props} activeItem='election' />
    }

    return (
        <div style= {{width: "100%"}}>
          {/* load Nav Bar */}
          <NavBar {...this.props} activeItem='election' />

          {/* message displays only if they submit an item to the database */}
          <Message hidden={!this.state.submitted} positive>
            <Message.Header >Submitted</Message.Header>
              <p>
                Start Time: {this.state.startTime} <br />
                End Time: {this.state.endTime} 
              </p>
          </Message>
          <br /><br />
          {this.renderForms()}

          {/* button to allow the admin to change election times */}
          <Button disabled={this.state.loading} style={{marginLeft:'10px'}} floated="left" color='red' onClick={this.openWarningMessage}>Edit Dates</Button>

            {/* warning pop up shown if they want to edit the times */}
            <Modal open={this.state.warningOpen}  basic size='small'>
              <Header icon='archive' content='Changing the Elections Dates' />
              <Modal.Content>
                <p>
                  You are about to change the election dates. Are you sure?
                </p>
              </Modal.Content>
              <Modal.Actions>
                <Button basic color='grey' inverted onClick={() => this.setDisabledState(true)}>
                  <Icon name='remove' /> No
                </Button>
                <Button color='red' inverted onClick={() => this.setDisabledState(false)}>
                  <Icon name='checkmark' /> Yes
                </Button>
              </Modal.Actions>
            </Modal>

        </div>
    );
  }
}



export default ElectionDate;
