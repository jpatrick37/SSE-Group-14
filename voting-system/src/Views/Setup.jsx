import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { firebase } from '../Firebase.jsx';

const buttonClasses = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
}));


class Setup extends Component {
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
            <h1>Setup</h1>
            <hr />
            <p>Upload CSV file to upload to Firebase (Temporary and will be moved to Admin App)</p>
            <input
                accept=".csv"
                className={buttonClasses.input}
                id="contained-button-file"
                hidden
                type="file"
            />
            <label htmlFor="contained-button-file">
                <Button variant="contained" component="span" className={buttonClasses.button}>
                    Upload CSV
                </Button>
            </label>
        </div>
        );
  }
}

export default Setup;