import React, { Component } from 'react';
import {DateTimeInput } from 'semantic-ui-calendar-react';
import { Form, Header, Modal, Button, Icon, Message } from 'semantic-ui-react'
import NavBar from './NavBar.jsx';
import { firebase } from '../Firebase';
import ReactLoading from 'react-loading';

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
        this.ref = firebase.firestore().collection("electionDetails")
    }

  // runs when the componet firsts loads
  componentDidMount(){
    // refrence to the spefic 'table' in firebase
    var timeDetailsRef = this.ref.doc("electionTime");
    
    // get data from 'table'
    timeDetailsRef.get().then(doc => {
      if (doc.exists){
        // get data
        let data = doc.data()
        
        // convert to javascript date objects
        let startTimeDateObject = new Date(data['startTime']['seconds'] *1000)
        let endTimeDateObject = new Date(data['endTime']['seconds'] * 1000)
        
        // convert to string
        let startTime = this.convertDateToString(startTimeDateObject)
        let endTime = this.convertDateToString(endTimeDateObject)
      // set the new start and end time as well as stop the loading component
        this.setState({
          startTime,
          endTime,
          loading: false
        })

      } else {
        console.log("No Document Found")
        this.setState({
          loading: false
        })
      }
    }).catch(error => {
      console.log("Error getting document", error)
      this.setState({
        loading: false
      })
    })
  }
  
  // converts a javascript date to a string of format dd-mm-yyy HH:MM
  convertDateToString = (date) => {
    let dateString = ""
    dateString += date.getDate()
    dateString += "-" + date.getMonth()
    dateString += "-" + date.getFullYear()
    dateString += " " + date.getHours()
    dateString += ":" + date.getMinutes()
    return dateString
  }

  // converts a string with format dd-mm-yyy HH:MM into a date object
  convertStringToDate(input){
    let splitArr = input.split("-").map(item => item.trim());
    let day = splitArr[0]
    let month = splitArr[1]

    let yearTime = splitArr[2].split(" ").map(item => item.trim());
    let year = yearTime[0]
    let time = yearTime[1]
    let timeSplit = time.split(":").map(item => item.trim());
    let hours = timeSplit[0]
    let minutes = timeSplit[1]

    let date = new Date(year, month, day)
    date.setHours(hours)
    date.setMinutes(minutes)
    return date;
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

  // submits the dates to firebase
  submitDates = () => {
    // refrecne to the firebase 'table'
    var timeDetailsRef = this.ref.doc("electionTime");

    // gets the startTime and endTime the user inputted
    let startTime = this.convertStringToDate(this.state.startTime)
    let endTime = this.convertStringToDate(this.state.endTime)
    
    // convert to object
    let object = {startTime: startTime, endTime: endTime}

    // submit object to the 'table'
    timeDetailsRef.set(object).then(doc => {
      console.log("Document uploaded")
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

  renderDates = () => {
    return (
      <div>
        <Header as='h1'>Start Time: {this.state.startTime} UTC</Header>
        <Header as='h1'>End Time: {this.state.endTime} UTC</Header>
      </div>
    )
  }

  renderForms = () => {
    if(this.state.disabled){
      return this.renderDates()
    }
    return(
          <div style= {{marginTop:'10px', marginLeft:'10px',width: "200px"}}>
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
      return <ReactLoading type="bubbles" color="blue" height={667} width={375} />
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
