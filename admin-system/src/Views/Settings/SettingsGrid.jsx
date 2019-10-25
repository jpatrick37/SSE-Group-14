import React, { Component } from 'react';
import NavBar from '../NavBar.jsx';
import { Grid } from 'semantic-ui-react'
import { IoIosPersonAdd } from 'react-icons/io'
import { Button } from 'semantic-ui-react'

// displays some settings the admin can do
class Settings extends Component {
  


  // loads the elctions date period
  gotToUserDetails = () => {
    this.props.history.push("/settings/user");
  }

  render() {

    return (
      <div style= {{width: "100%"}}>
        {/* nav bar */}
        <NavBar {...this.props} activeItem='settings' />
        
        {/* grid of optinoos for the admin */}
        <Grid style={{marginLeft: "10px"}} doubling columns={1} >
          <Grid.Row>
            <Grid.Column>
              <IoIosPersonAdd size="10em"/>
              <br/>
              <Button onClick={this.gotToUserDetails} >View User Details</Button> 
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}


export default Settings;
