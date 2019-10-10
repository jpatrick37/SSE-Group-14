import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { Container, Row } from "react-bootstrap";

import './App.css';
import Login from './Views/Login.jsx';
import Home from './Views/Home.jsx';
import RouteObjects from './routes.js';

import { firebase } from './Firebase.jsx';

class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = ({
      user: null,
    });
    this.authListener = this.authListener.bind(this);
    this.usersRef = firebase.firestore().collection('users');
  }

  componentDidMount() {
    this._isMounted = true;
    this.authListener();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // Listening to see if logged in or out
  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        let userRef = this.usersRef.doc(user.uid);
        userRef.get().then(doc => {
          if (!doc.exists) {
            this.setState({ user: null });
          } else {
            console.log(doc.data());
            this.setState({ user: doc.data() });
          }
        })
        .catch(err => {
          console.log('Error getting document', err);
        })
      }
      else {
        this.setState({ user: null });
      }
    });
  }

  getRoutes = routes => {
    return routes.map((route, key) => {
      return (
        <Route
          path={route.path}
          render={props => (<route.component {...props}/>)}
          key={key}
        />
      );
    });
  };

  render() {
    // Router logic
    var renderPath = "";
    var redirectPath = "";
    var pageComponents = {
      home: Home,
      login: Login,
    }
    var RenderPage = "";
    // Home
    if (this.state.user) {
      renderPath = "/home";
      RenderPage = pageComponents["home"];
      redirectPath = "/home";
    } else {
      // Login
      renderPath = "/login";
      RenderPage = pageComponents["login"];
      redirectPath = "/login";
    }
    // Rendering
    return (
      <div className="App">
        <Container fluid >
          <Row>
            <Router>
              <Switch>
                { this.getRoutes(RouteObjects) }
                <Route path={renderPath} render={props => <RenderPage {...props} />} />
                <Redirect from="/" to={redirectPath} />
              </Switch>
            </Router>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
