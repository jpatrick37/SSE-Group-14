import React, { Component } from 'react';
import NavBar from './NavBar.jsx';
import { Grid } from 'semantic-ui-react'
import { IoIosPersonAdd, IoMdWarning, IoIosKey } from 'react-icons/io'
import { Button } from 'semantic-ui-react'


class Settings extends Component {
  
  constructor(props) {
    super(props);
    this.state = ({
    })
  }

  render() {

    return (
      <div style= {{width: "100%"}}>
        <NavBar {...this.props} activeItem='settings' />
        <Grid style={{marginLeft: "10px"}} doubling columns={3} >
          <Grid.Row>
            <Grid.Column>
              <IoIosPersonAdd color="red" size="10em"/>
              <br/>
              <Button color="red" >Add New Admin</Button> 
            </Grid.Column>
            <Grid.Column>
              <IoMdWarning color="red" size="10em"/>
              <br/>
              <Button color="red" >Delete This Account</Button> 
            </Grid.Column>
            <Grid.Column>
              <IoIosKey size="10em"/>
              <br/>
              <Button >Generate new password</Button> 
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}


export default Settings;
