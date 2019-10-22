import React, { Component } from 'react';
import { firebase } from '../Firebase.jsx';
import NavBar from './NavBar.jsx';


class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state = ({ activeItem: 'home',
                    mountedComponent: null
    })
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
  logout = () => {
    firebase.auth().signOut();
  }


  gotoSetup = () => {
    this.props.history.push("/setup");
  }

  render() {
    return (
      <div style= {{width: "100%"}}>
        <NavBar {...this.props} activeItem='election' />
        <p> i am a election</p>
      </div>
    )
  }
}


export default Home;
