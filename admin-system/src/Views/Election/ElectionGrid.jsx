import React, { Component } from 'react';
import NavBar from '../NavBar.jsx';
import { IoIosToday, IoIosCalendar } from 'react-icons/io'
import { Grid, Button } from 'semantic-ui-react'


// this card dispalys a list of what the admin can do in the Election header
class Election extends Component {

  // loads the Election paper
  gotoViewElection = () => {
    this.props.history.push("/election/paper");
  }

  // loads the elctions date period
  gotoElectionDate = () => {
    this.props.history.push("/election/date");
  }

  render() {
    return (
      <div style= {{width: "100%"}}>
        {/* load the NavBar */}
        <NavBar {...this.props} activeItem='election' />
        {/* grid of items admin can do */}
        <Grid style={{marginLeft: "10px"}} columns={2} >
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
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}


export default Election;
