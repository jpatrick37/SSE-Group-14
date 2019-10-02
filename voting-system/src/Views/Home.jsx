import React, { Component } from 'react';
import { firebase } from '../Firebase.jsx';
import { Button } from "react-bootstrap";

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

  render() {
    return (
      <div className="App">
        <h1>HOME</h1>
        <Button onClick={this.logout}>Log Out</Button>
      </div>
    );
  }
}

export default Home;
