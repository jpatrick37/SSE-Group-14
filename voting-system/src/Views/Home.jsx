import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Home extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
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
            <Link to='/login'>
                Login
            </Link>
      </div>
    );
  }
}

export default Home;
