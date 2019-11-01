import React, { Component } from 'react';
import { firebase } from '../Firebase.jsx';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

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

  render() {
    const buttonClasses = makeStyles(theme => ({
      button: {
        margin: theme.spacing(10),
        padding: "10px"
      }
    }));
    return (
      <div className="App container">
        <Container component="main" maxWidth={"xs"}>
          <h1>HOME</h1>
          <hr />
          <Button onClick={this.gotoVote} fullWidth variant="contained" color="primary" className={buttonClasses.button}>Vote</Button>
          <Button onClick={this.logout} fullWidth variant="contained" color="secondary" className={buttonClasses.button}>Log Out</Button>
        </Container>
      </div>
    );
  }
}

export default Home;