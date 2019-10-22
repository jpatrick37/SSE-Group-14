import React, { Component } from 'react';
import NavBar from './NavBar.jsx';
import { IoIosToday } from 'react-icons/io'
import { Grid, Button } from 'semantic-ui-react'



class Election extends Component {
  constructor(props) {
    super(props);
    this.state = ({ 
    })
  }


  gotoViewElection = () => {
    this.props.history.push("/election/paper");
  }

  render() {
    return (
      <div style= {{width: "100%"}}>
        <NavBar {...this.props} activeItem='election' />
        <Grid style={{marginLeft: "10px"}} columns={1} >
          <Grid.Row>
            <Grid.Column>
              <IoIosToday size="10em"/>
              <br/>
              <Button onClick={this.gotoViewElection} >View Election Paper</Button> 
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}


export default Election;
