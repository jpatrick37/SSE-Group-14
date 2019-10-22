import React, { Component } from 'react';
import {DateInput, TimeInput, DateTimeInput, DatesRangeInput } from 'semantic-ui-calendar-react';
import { Form, Header, Modal, Button, Icon } from 'semantic-ui-react'
import NavBar from './NavBar.jsx';


class ElectionDate extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            startTime: '',
            endTime: '',
            disabled: true,
            warningOpen: false
        };
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
      this.setState({ [name]: value });
    }
    console.log(this.convertToDateObject(value))
  }
  handleChangeEnd = (event, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
    console.log(this.convertToDateObject(value))
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
            <br /><br />
          <Button style={{marginLeft:'10px'}} floated="left" color='red' onClick={this.openModal}>Edit Dates Access</Button>
          <br /><br /><br />
            <div style= {{marginTop:'10px', marginLeft:'10px',width: "200px"}}>
                <Header disabled={this.state.disabled} large>Start Date</Header>
                <Form>
                    <DateTimeInput disabled={this.state.disabled}
                    name="startTime"
                    placeholder="Date Time"
                    value={this.state.startTime}
                    iconPosition="left"
                    onChange={this.handleChangeStart}
                    />
                </Form>
                <Header disabled={this.state.disabled} large>End Date</Header>
                <Form>
                    <DateTimeInput disabled={this.state.disabled}
                    name="endTime"
                    placeholder="Date Time"
                    value={this.state.endTime}
                    iconPosition="left"
                    onChange={this.handleChangeEnd}
                    />
                </Form>
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
