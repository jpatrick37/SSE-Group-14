import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { Container, Row } from "react-bootstrap";

import './App.css';
import Login from './Views/Login';
import Home from './Views/Home';
import RouteObjects from './routes.js';

import { firebase } from './Firebase';

import ReactLoading from 'react-loading';

class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = ({
      user: null,
      fetchingUser: true
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
            this.setState({ user: null, fetchingUser: false });
          } else {
            console.log(doc.data());
            this.setState({ user: doc.data(), fetchingUser: false });
          }
        })
        .catch(err => {
          console.log('Error getting document', err);
        })
      }
      else {
        this.setState({ user: null, fetchingUser: false });
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
    // if havn't fetch user display loading bar
    if(this.state.fetchingUser){
      return <ReactLoading type="bubbles" color="blue" height={667} width={375} />
    }
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
                { this.state.user && this.getRoutes(RouteObjects) }
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
