import React, { Component } from 'react';
import NavBar from '../NavBar.jsx';
import { List } from 'semantic-ui-react'



// displalys the users details
class UserDetails extends Component {
    render() {
        return (
            <div style= {{width: "100%"}}>
                    {/* displays the Nav bar */}
                <NavBar {...this.props} activeItem='settings' />

                {/* conatins a list of the users details */}
                <div style={{margin: '30px'}}>
                    <List floated="left">
                        <List.Item as='h2' icon='users' content={this.props.user['name']}/>
                        <List.Item
                            as='h2' 
                            icon='mail'
                            content={<a href={'mailto:' + this.props.userDetails['email']}>{this.props.userDetails['email']}</a>}
                        />
                    </List>
                </div>
            </div>
        );
    }
}



export default UserDetails;
