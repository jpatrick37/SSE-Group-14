import React, { Component } from 'react';
import {DateTimeInput } from 'semantic-ui-calendar-react';
import { Form, Header, Modal, Button, Icon, Message } from 'semantic-ui-react'
import NavBar from './NavBar.jsx';
import { firebase } from '../Firebase';

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
        this.ref = firebase.firestore().collection("electionDetails")
    }

  componentDidMount(){
    var timeDetailsRef = this.ref.doc("electionTime");
    
    // get data
    timeDetailsRef.get().then(doc => {
      if (doc.exists){
        // get data
        let data = doc.data()
        
        // convert to javascript date objects
        let startTimeDateObject = new Date(data['startTime']['seconds'] *1000)
        let endTimeDateObject = new Date(data['endTime']['seconds'] * 1000)
        
        // convert to string
        let startTime = this.convertToString(startTimeDateObject)
        let endTime = this.convertToString(endTimeDateObject)
        console.log(startTime)
        this.setState({
          startTime,
          endTime,
          loading: false
        })

      } else {
        console.log("no doc")
        this.setState({
          loading: false
        })
      }
    }).catch(function(error) {
      console.log("Error getting document", error)
      this.setState({
        loading: false
      })
    })
  }

  convertToString = (date) => {
    // 16-10-2019 14:50
    let dateString = ""
    dateString += date.getDate()
    dateString += "-" + date.getMonth()
    dateString += "-" + date.getFullYear()
    dateString += " " + date.getHours()
    dateString += ":" + date.getMinutes()
    return dateString
  }

  convertToDateObject(input){
    // 16-10-2019 14:50
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
    
  handleChangeStart = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value, submitted: false });
    }
  }
  handleChangeEnd = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value, submitted: false });
    }
  }

  // submits the dates to firebase
  submitDates = () => {
    var timeDetailsRef = this.ref.doc("electionTime");

    let startTime = this.convertToDateObject(this.state.startTime)
    let endTime = this.convertToDateObject(this.state.endTime)
    // submit function
    let object = {startTime: startTime, endTime: endTime}

    timeDetailsRef.set(object).then(doc => {
      console.log("Document uploaded")
      this.setState({submitted: true})
    }).catch(function(error) {
      console.log("Error writing document", error)
    })
  }
  
  setDisabledState = (value) => {
    console.log(value)
    this.setState({ warningOpen: false, disabled: value });
  }

  openModal = () => {
    this.setState({ warningOpen: true });
  }

  

  render() {
    return (
        <div style= {{width: "100%"}}>
          <NavBar {...this.props} activeItem='election' />
          <Message hidden={!this.state.submitted} positive>
            <Message.Header >Submitted</Message.Header>
              <p>
                Start Time: {this.state.startTime} <br />
                End Time: {this.state.endTime} 
              </p>
          </Message>
            <br /><br />
          <Button disabled={this.state.loading} style={{marginLeft:'10px'}} floated="left" color='red' onClick={this.openModal}>Edit Dates</Button>
          <br /><br /><br />
            <div style= {{marginTop:'10px', marginLeft:'10px',width: "200px"}}>
                <Header disabled={this.state.disabled} large="true">Start Date</Header>
                <Form>
                    <DateTimeInput disabled={this.state.disabled}
                    name="startTime"
                    placeholder="Date Time"
                    value={this.state.startTime}
                    iconPosition="left"
                    onChange={this.handleChangeStart}
                    />
                </Form>
                <Header disabled={this.state.disabled} large="true">End Date</Header>
                <Form>
                    <DateTimeInput disabled={this.state.disabled}
                    name="endTime"
                    placeholder="Date Time"
                    value={this.state.endTime}
                    iconPosition="left"
                    onChange={this.handleChangeEnd}
                    />
                </Form>
                <Button style={{margin: '10px'}} disabled={this.state.disabled} onClick={this.submitDates}>Submit</Button>
            </div>
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
