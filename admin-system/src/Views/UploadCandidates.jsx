import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CSVReader from "react-csv-reader";
import { firebase } from '../Firebase.jsx';
import * as ObjectHash from 'object-hash';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { Header, Modal } from 'semantic-ui-react'
import NavBar from "./NavBar"
import Popup from "reactjs-popup";


const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const notificationStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const buttonClasses = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1),
    },
    input: {
        display: 'none',
    },
}));

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};

function MySnackbarContentWrapper(props) {
  const classes = notificationStyles();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

class UploadCandidates extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      vertical: 'top',
      horizontal: 'right',
      message: 'Message',
      variant: "success",
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleCSVUpload = (data) => {
    this.candidatesRef = firebase.firestore().collection('candidates');
    var fields = data[0];
    for (var i=1; i<data.length; i++) {
      if (fields.length === data[i].length) {
        var obj = {};
        for (var j=0; j<fields.length; j++) {
          obj[fields[j]] = data[i][j];
        }
        this.candidatesRef.doc(ObjectHash(obj)).set(obj);
      }
    }
    this.setState({ 
      open: true, 
      message: "Sucessfully uploaded CSV file to Firebase!",
      variant: "success",
    });
  }
  render() {
    const { open, vertical, horizontal, message, variant } = this.state;
    return (
      <div style= {{width: "100%"}}>
        <NavBar {...this.props} activeItem='candidates' />
        <Header>Add New Candidates</Header>
        <hr />
        <p>Upload CSV file to upload to Firebase</p>
        <CSVReader
          cssClass="hidden-csv-reader-input"
          cssInputClass="hidden-csv-reader-input"
          onFileLoaded={this.handleCSVUpload}
          inputId={"contained-button-file"}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span" className={buttonClasses.button}>
            Upload CSV File
          </Button>
        </label>
        {/* Notification (Snackbar) */}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          onClose={() => this.setState({open: false})}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
        >
          <MySnackbarContentWrapper
            onClose={() => this.setState({open: false})}
            variant={variant}
            message={message}
          />
        </Snackbar>
      </div>
    );
  }
}

export default UploadCandidates;