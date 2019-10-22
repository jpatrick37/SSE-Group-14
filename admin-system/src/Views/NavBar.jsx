import React, { Component } from 'react';
import { firebase } from '../Firebase.jsx';
import { Menu } from 'semantic-ui-react'


class NavBar extends Component {
  
  constructor(props) {
    super(props);
    this.state = ({ activeItem: this.props.activeItem,
                    mountedComponent: null
    })
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  
  logout = () => {
    firebase.auth().signOut();
  }

  gotoCandidates = (e, { name }) => {
    this.props.history.push("/candidates");
    this.setState({ activeItem: name })
  }

  gotoHome = (e, { name }) => {
    this.props.history.push("/home");
    this.setState({ activeItem: name })
  }
  
  gotoElection = (e, { name }) => {
    this.props.history.push("/election");
    this.setState({ activeItem: name })
  }

  gotoSettings = (e, { name }) => {
    this.props.history.push("/settings");
    this.setState({ activeItem: name })
  }


  render() {
    const { activeItem } = this.state

    return (
      <div>
        <Menu secondary big>
          <Menu.Item
            name='home'
            active={activeItem === 'home'}
            onClick={this.gotoHome}
          />
          <Menu.Item
            name='candidates'
            active={activeItem === 'candidates'}
            onClick={this.gotoCandidates}
          />
          <Menu.Item
            name='election details'
            active={activeItem === 'election'}
            onClick={this.gotoElection}
          />
          <Menu.Menu position='right'>
            <Menu.Item
              name='settings'
              active={activeItem === 'settings'}
              onClick={this.gotoSettings}
            />
            <Menu.Item
              name='logout'
              active={activeItem === 'logout'}
              onClick={this.logout}
            />
          </Menu.Menu>
        </Menu>
        {this.state.mountedComponent}
      </div>
    )
  }
}


export default NavBar;
