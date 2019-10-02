import React, { Component } from 'react';
import { firebase } from '../Firebase.jsx';

class Login extends Component {
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
          <input></input>
          <input></input>
      </div>
    );
  }
}

export default Login;
