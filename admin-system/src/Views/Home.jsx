import React, { Component } from 'react';
import NavBar from './NavBar.jsx';
import { Grid, Header, Button } from 'semantic-ui-react'
import { IoIosToday, IoIosCalendar, IoIosList } from 'react-icons/io'


class Home extends Component {

  // loads the Election paper
  gotoViewElection = () => {
    this.props.history.push("/election/paper");
  }

  // loads the elctions date period
  gotoElectionDate = () => {
    this.props.history.push("/election/date");
  }

  // loads the list of candiates page
  gotoCandidatesList = () => {
    this.props.history.push("/candidates/list");
  }
  
  render() {
    return (
      <div style= {{width: "100%"}}>
        <NavBar {...this.props} activeItem='home' />
        <Header as ='h1'>Welcome {this.props.user['name']}</Header>
        <Header as ='h4'>You can find some quick settings below, or use the top bar for more settings</Header>

        <Grid style={{marginLeft: "10px"}} doubling columns={3} >
          <Grid.Row>
            <Grid.Column>
              <IoIosToday size="10em"/>
              <br/>
              <Button onClick={this.gotoViewElection} >View Election Paper</Button> 
            </Grid.Column>
            <Grid.Column>
              <IoIosCalendar size="10em"/>
              <br/>
              <Button onClick={this.gotoElectionDate} >View Election Date</Button> 
            </Grid.Column>
            <Grid.Column>
              <IoIosList size="10em"/>
              <br/>
              <Button onClick={this.gotoCandidatesList}>View Candidates</Button> 
            </Grid.Column>
          </Grid.Row>
        </Grid>

      </div>
    )
  }
}


export default Home;
