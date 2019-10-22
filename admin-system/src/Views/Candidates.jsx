import React, { Component } from 'react';
import NavBar from './NavBar.jsx';
import { Grid } from 'semantic-ui-react'
import { IoMdCloudUpload, IoIosList } from 'react-icons/io'
import { Button } from 'semantic-ui-react'
import { UploadCandidates } from "./UploadCandidates"

class Candidates extends Component {
  
  constructor(props) {
    super(props);
    this.state = ({
    })
  }
  
  gotoUpdateCandidates = () => {
    this.props.history.push("/candidates/update");
  }

  gotoCandidatesList = () => {
    this.props.history.push("/candidates/list");
  }

  render() {

    return (
      <div style= {{width: "100%"}}>
        <NavBar {...this.props} activeItem='candidates' />
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
