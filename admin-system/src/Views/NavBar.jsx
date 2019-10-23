import React, { Component } from 'react';
import { firebase } from '../Firebase.jsx';
import { Menu } from 'semantic-ui-react'

// nav bar, displayed at the top of each page for eay navigation
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = ({ activeItem: this.props.activeItem
    })
  }

  // logouts of firebase
  logout = () => {
    firebase.auth().signOut();
  }

  // goes to the candiates page
  gotoCandidates = (e, { name }) => {
    this.props.history.push("/candidates");
    this.setState({ activeItem: name })
  }

  // goes to the home page
  gotoHome = (e, { name }) => {
    this.props.history.push("/home");
    this.setState({ activeItem: name })
  }
  
  // goes to the election page
  gotoElection = (e, { name }) => {
    this.props.history.push("/election");
    this.setState({ activeItem: name })
  }

  // goes to the settings page
  gotoSettings = (e, { name }) => {
    this.props.history.push("/settings");
    this.setState({ activeItem: name })
  }

  render() {
    
    return (
      <div>
        {/* nav bar each menu */}
        <Menu secondary big="true">
          <Menu.Item
            name='home'
            active={this.state.activeItem === 'home'}
            onClick={this.gotoHome}
          />
          <Menu.Item
            name='candidates'
            active={this.state.activeItem === 'candidates'}
            onClick={this.gotoCandidates}
          />
          <Menu.Item
            name='election details'
            active={this.state.activeItem === 'election'}
            onClick={this.gotoElection}
          />
          <Menu.Menu position='right'>
            <Menu.Item
              name='settings'
              active={this.state.activeItem === 'settings'}
              onClick={this.gotoSettings}
            />
            <Menu.Item
              name='logout'
              active={this.state.activeItem === 'logout'}
              onClick={this.logout}
            />
          </Menu.Menu>
        </Menu>
      </div>
    )
  }
}


export default NavBar;
