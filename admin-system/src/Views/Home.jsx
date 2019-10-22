import React, { Component } from 'react';
import { firebase } from '../Firebase.jsx';
import NavBar from './NavBar.jsx';


class Home extends Component {
  
  constructor(props) {
    super(props);
    this.state = ({ activeItem: 'home',
    })
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
  logout = () => {
    firebase.auth().signOut();
  }



  render() {

    return (
      <div style= {{width: "100%"}}>
        <NavBar {...this.props} activeItem='home' />
      </div>
    )
  }
}


export default Home;
