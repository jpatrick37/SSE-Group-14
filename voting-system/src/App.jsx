import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Login from './Views/Login.jsx';
import Home from './Views/Home.jsx';

class App extends Component {
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
        <Router>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
        </Router>   
      </div>
    );
  }
}

export default App;
