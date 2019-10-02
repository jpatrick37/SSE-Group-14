import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { firebase } from './Firebase.jsx';

class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.testsRef = firebase.firestore().collection('tests');
  }

  onCollectionUpdate = (querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      var { 
        apple,
        name,
      } = doc.data();
      data.push({
          key: doc.id,
          doc, // DocumentSnapshot
          apple,
          name,
      });
    });
    if (this._isMounted) {
      this.setState({ data });
    }
  }

  componentDidMount() {
    this._isMounted = true;
    this.unsubscribe = this.testsRef.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    var firebasedata = [];
    for (var i=0; i<this.state.data.length; i++) {
      firebasedata.push(
        <p key={i}>
          {this.state.data[i].apple} {this.state.data[i].name}
        </p>
      );
    }
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          {firebasedata}
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
