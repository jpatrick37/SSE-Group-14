import React, { Component } from 'react';
import { firebase } from '../Firebase.jsx';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

class Home extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  logout = () => {
    firebase.auth().signOut();
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  gotoVote = () => {
    this.props.history.push("/vote");
  }

  gotoSetup = () => {
    this.props.history.push("/setup");
  }

  render() {
    const buttonClasses = makeStyles(theme => ({
      button: {
        margin: theme.spacing(10),
      }
    }));
    return (
      <div className="App">
        <Grid container justify = "center">
          <Container maxWidth={"xl"}>
            <h1>HOME</h1>
            <hr />
            <Button onClick={this.gotoVote} variant="contained" color="primary" className={buttonClasses.button}>Vote</Button>
            <Button onClick={this.logout} variant="contained" color="secondary" className={buttonClasses.button}>Log Out</Button>
          </Container>
        </Grid>
      </div>
    );
  }
}

export default Home;
