import React, { Component } from 'react';
import NavBar from './NavBar.jsx';
import { Grid } from 'semantic-ui-react'
import { IoMdCloudUpload, IoIosList } from 'react-icons/io'
import { Button } from 'semantic-ui-react'

// this card dispalys a list of what the admin can do in the candidate header
class Candidates extends Component {
    
  // loads the update candidate page
  gotoUpdateCandidates = () => {
    this.props.history.push("/candidates/update");
  }

  // loads the list of candiates page
  gotoCandidatesList = () => {
    this.props.history.push("/candidates/list");
  }

  render() {

    return (
      <div style= {{width: "100%"}}>
        {/* load the Nav Bar */}
        <NavBar {...this.props} activeItem='candidates' />
        
        {/* grid of buttons for each action */}
        <Grid style={{marginLeft: "10px"}} columns={2} >
          <Grid.Row>
            <Grid.Column>
              <IoMdCloudUpload color="red" size="10em"/>
              <br/>
              <Button color="red" onClick={this.gotoUpdateCandidates} >Upload Candidates</Button> 
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


export default Candidates;
