import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { Container, Row } from "react-bootstrap";

import './App.css';
import Results from './Views/Results.jsx';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Container fluid >
          <Row>
            <Router>
              <Switch>
                <Route path='/' component={Results}  />
              </Switch>
            </Router>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
