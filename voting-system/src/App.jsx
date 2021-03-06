import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { Container, Row } from "react-bootstrap";
import MUIContainer from '@material-ui/core/Container';
import './App.css';
import Login from './Views/Login.jsx';
import Home from './Views/Home.jsx';
import RouteObjects from './routes.js';
import ReactLoading from 'react-loading';
import { firebase } from './Firebase.jsx';

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
            var theUser = doc.data();
            theUser.id = doc.id;
            this.setState({ user: theUser, fetchingUser: false });
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
          render={props => (<route.component {...props} user={this.state.user}/>)}
          key={key}
        />
      );
    });
  };

  render() {
    // If user hasn't been fetched yet
    if(this.state.fetchingUser){
      return (
        <div className="App container">
          <MUIContainer component="main" maxWidth="xs">
            <Container fluid >
              <ReactLoading type="bubbles" color="blue" height={667} width={375} />
            </Container>
          </MUIContainer>
        </div>
      )
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
                <Route path={renderPath} render={props => <RenderPage {...props} user={this.state.user} />} />
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
