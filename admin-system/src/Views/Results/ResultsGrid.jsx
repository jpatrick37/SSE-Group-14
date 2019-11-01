import React, { Component } from 'react';
import NavBar from '../NavBar.jsx';
import { Grid, Button } from 'semantic-ui-react'
import { IoIosBrowsers } from 'react-icons/io'


class Results extends Component {
  
    // loads the claculation page
    goToResultsCalculation = () => {
      this.props.history.push("/results/calculation");
    }
  render() {
    return (
      <div style= {{width: "100%"}}>
        <NavBar {...this.props} activeItem='results' />

        {/* grid of items admin can do */}
        <Grid style={{marginLeft: "10px"}} columns={1} >
          <Grid.Row>
            <Grid.Column>
              <IoIosBrowsers size="10em"/>
              <br/>
              <Button onClick={this.goToResultsCalculation} >Calculate Results</Button> 
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}


export default Results;
