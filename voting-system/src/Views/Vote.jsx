import React, { Component } from 'react';
import { Row, Col, FormGroup, FormLabel, FormControl, Container as BootstrapContainer, Card, Image } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { firebase } from '../Firebase.jsx';
import logo from './../assets/images/ausgovlogo.png';
import ReactLoading from 'react-loading';
import MUIContainer from '@material-ui/core/Container';

// Snackbar Imports
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

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const useStyles1 = makeStyles(theme => ({
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

function MySnackbarContentWrapper(props) {
  const classes = useStyles1();
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

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};

const charCode = 'a'.charCodeAt(0);

var toAlphaNumber = function (a) {
  var b = [a], sp, out, i, div;

    sp = 0;
    while(sp < b.length) {
        if (b[sp] > 25) {
            div = Math.floor(b[sp] / 26);
            b[sp + 1] = div - 1;
            b[sp] %= 26;
        }
        sp += 1;
    }

    out = "";
    for (i = 0; i < b.length; i += 1) {
        out = String.fromCharCode(charCode + b[i]) + out;
    }

    return out;
}

class Vote extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      parties: {},
      candidates: [],
      data: [],
      vote: {},
      fetchingCandidates: true,
      open: false,
      vertical: 'top',
      horizontal: 'right',
    };
    this.candidatesRef = firebase.firestore().collection('candidates');
  }

  onCandidatesCollectionUpdate = (querySnapshot) => {
    // Variables
    var candidates = [];
    var parties = [];
    var partiesCheck = {};
    var index = 0;
    // Fetching
    querySnapshot.forEach(doc => {
      // Pushing to variables
      // Setting up candidate
      var candidate = doc.data();
      candidate.id = doc.id;
      candidate.BALLOT_POSITION = parseInt(candidate.BALLOT_POSITION);
      candidates.push(candidate);
      // Setting up party
      if (partiesCheck.hasOwnProperty(candidate.PARTY)) {
        parties[partiesCheck[candidate.PARTY]].candidates.push(candidate);
        parties[partiesCheck[candidate.PARTY]].BALLOT_POSITION = Math.min(parties[partiesCheck[candidate.PARTY]].BALLOT_POSITION, candidate.BALLOT_POSITION)
      } else {
        parties.push({NAME: candidate.PARTY, BALLOT_POSITION: candidate.BALLOT_POSITION, candidates: [candidate]});
        partiesCheck[candidate.PARTY] = index++;
      }
    });
    // Sorting candidates and partiesObj
    candidates.sort((a, b) => (a.BALLOT_POSITION > b.BALLOT_POSITION) ? 1 : -1);
    parties.sort((a, b) => (a.BALLOT_POSITION > b.BALLOT_POSITION) ? 1 : -1);
    console.log(parties);
    // Storing in React State
    if (this._isMounted) {
      var vote = this.setupVoteObject(parties);
      this.setState({ candidates, parties, vote, fetchingCandidates: false });
    }
  }

  setupVoteObject = (parties) => {
    var vote = { parties: {}, candidates: {} };
    for (var i=0; i<parties.length; i++) {
      var partyKey = ("POSITION:"+parties[i].BALLOT_POSITION+"|NAME:"+parties[i].NAME).toLowerCase().replace(/\s/g,'-');
      vote.parties[partyKey] = "-";
      for (var j=0; j<parties[i].candidates.length; j++) {
        var candidateKey = ("POSITION:"+parties[i].candidates[j].BALLOT_POSITION+"|SURNAME:"+parties[i].candidates[j].SURNAME+'|GIVEN_NAMES:'+parties[i].candidates[j].GIVEN_NAMES+"|PARTY:"+parties[i].NAME.replace(/\s/g,'-')).toLowerCase();
        vote.candidates[candidateKey] = "-";
      }
    }
    return vote;
  }

  componentDidMount() {
    this._isMounted = true;
    this.unsubscribe = this.candidatesRef.onSnapshot(this.onCandidatesCollectionUpdate);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleVoteFormChange = (event) => {
    var { vote } = this.state;
    var { id, value } = event.target;
    if (id.indexOf("surname") !== -1 && id.indexOf("given_names")) {
      vote.candidates[id] = value;
    } else {
      vote.parties[id] = value;
    }
    this.setState({ vote });
    // console.log(event.target.id, event.target.value);
  }

  setupPartiesInput = (parties) => {
    var inputs = parties.map(function (party, index) {
      var uniqueKey = ("POSITION:"+party.BALLOT_POSITION+"|NAME:"+party.NAME).replace(/\s/g,'-').toLowerCase();
      var inputOptions = [<option key={uniqueKey+"--"}>-</option>];
      for (var i=1; i<=parties.length; i++) {
        inputOptions.push(
          <option value={i} key={uniqueKey+"-option-"+i}>{i}</option>
        );
      }
      return (
        <div key={uniqueKey+"-formgroup"} className={"flex-column"} style={{padding: "10px", display: "inline-block", float: "none", height: "100%"}}>
          <Col md={8} style={{borderLeft: "1px solid black"}}>
            <Card style={{height: "100%", border: "0px"}}>
              <FormGroup>
                <p style={{float: "left"}}>{toAlphaNumber(index).toUpperCase()}</p>
                <br />
                <br />
                <FormControl as="select" id={uniqueKey} style={{padding: "1px", border: "3px solid black", width: "45px", WebkitAppearance: "none", MozAppearance: "none", textIndent: "1px", textOverflow: ""}}>
                  {inputOptions}
                </FormControl>
                <br />
                <FormLabel><b>{party.NAME}</b></FormLabel>
              </FormGroup>
            </Card>
          </Col>
        </div>
      );
    });
    return inputs;
  }

  setupCandidatesInput = (candidates, parties) => {
    var inputs = parties.map(function (party, index) {
      var candidatesInputs = [];
      for (var i=0; i<party.candidates.length; i++) {
        // Unique Key
        var uniqueKey = ("POSITION:"+party.candidates[i].BALLOT_POSITION+"|SURNAME:"+party.candidates[i].SURNAME+"|GIVEN_NAMES:"+party.candidates[i].GIVEN_NAMES+"|PARTY:"+party.NAME.replace(/\s/g,'-')).toLowerCase();
        // Setting up options
        var inputOptions = [<option key={uniqueKey+"--"}>-</option>];
        for (var j=1; j<=candidates.length; j++) {
          inputOptions.push(
            <option value={j} key={uniqueKey+"-option-"+j}>{j}</option>
          );
        }
        // Setting up candidates voting
        candidatesInputs.push(
          <Row key={uniqueKey+"-formgroup"}>
            <FormGroup>
              <Row>
                <Col md={6}>
                  <FormControl as="select" id={uniqueKey} style={{padding: "1px", margin: "0px", border: "3px solid black", width: "45px", WebkitAppearance: "none", MozAppearance: "none", textIndent: "1px", textOverflow: ""}}>
                    {inputOptions}
                  </FormControl>
                </Col>
                <Col md={6}>
                  <p style={{padding: "0px", margin: "0px", textAlign: "justify"}}>{party.candidates[i].SURNAME}</p>
                  <p style={{padding: "0px", margin: "0px", textAlign: "justify"}}>{party.candidates[i].GIVEN_NAMES}</p>
                  <p style={{padding: "0px", margin: "0px", textAlign: "justify"}}><small>{party.NAME}</small></p>
                </Col>
              </Row>
            </FormGroup>
          </Row>
        );
      }
      // Returning
      return (
        <div key={party.NAME.replace(/\s/g,'-').toLowerCase()+"-candidates-cols"} style={{padding: "10px", display: "inline-block", float: "none", borderLeft: "1px solid black"}}>
          <Col md={8}>
            <Card style={{height: "100%", border: "0px"}}>
              <FormLabel><b>{party.NAME}</b></FormLabel>
              <hr />
              <br />
              {candidatesInputs}
            </Card>
          </Col>
        </div>
      );
    });
    return inputs;
  }

  checkVote = (vote) => {
    console.log("Checking votes");
  }

  convertVoteToObjectFormat = (vote) => {
    var candidates = [];
    var parties = [];
    var above_the_line_array = [];
    var below_the_line_array = [];
    for (var candidateID of Object.keys(vote.candidates)) {
      var candidate = {};
      var split = candidateID.split("|");
      candidate.SURNAME = split[0].split(":")[1].toUpperCase();
      candidate.GIVEN_NAMES = split[1].split(":")[1].toUpperCase();
      candidate.PARTY = split[2].split(":")[1].toUpperCase().replace(/-/g,' ');
      candidate.PREFERENCE = vote.candidates[candidateID];
      candidates.push(candidate);
    }
    for (var partyID of Object.keys(vote.parties)) {
      var party = {};
      party.NAME = partyID.replace(/-/g,' ').toUpperCase();
      party.PREFERENCE = vote.parties[partyID];
      parties.push(party);
    }
    console.log(candidates, parties);
  }

  handleVoteSubmit = (e) => {
    e.preventDefault();
    this.checkVote(this.state.vote);
    this.setState({open: true});
    console.log(this.state.vote);
    // this.convertVoteToObjectFormat(this.state.vote);
    this.props.history.push("/home");
  }

  gotoHome = () => {
    this.props.history.push("/home");
  }

  render() {
    // If candidates hasn't been fetched yet
    if(this.state.fetchingCandidates){
      return (
        <div className="App container">
          <MUIContainer component="main" maxWidth="xs">
            <BootstrapContainer fluid >
              <ReactLoading type="bubbles" color="blue" height={667} width={375} />
            </BootstrapContainer>
          </MUIContainer>
        </div>
      )
    }
    const buttonClasses = makeStyles(theme => ({
      button: {
        margin: theme.spacing(10),
      }
    }));
    // For snackbar i.e. notifications
    const { vertical, horizontal, open } = this.state;
    return (
      <div className="App content">
        <BootstrapContainer style={{padding: "30px"}}>
          <Row>
            <Image src={logo} style={{maxHeight: "50px", float: "left", paddingRight: "30px"}}/>
            <h5 style={{textAlign: "justify", float: "right"}}> Senate Ballot Paper<br/><b>State</b> - Election of {"n"} Senators</h5>
          </Row>
          <hr />
          <Row>
            <form onChange={this.handleVoteFormChange} onSubmit={this.handleVoteSubmit} style={{padding: "20px"}}>
              {/* Generating parties input */}
              <Row style={{overflowX: "auto"}}>
                <Col md={1}>
                  <Card style={{border: "none"}}>
                    <div style={{textAlign: "justify"}}>
                      <h5><b>You may vote in one of two ways</b></h5>
                      <h5 style={{backgroundColor: "#212529", color: "white"}}><b>Either:</b></h5>
                      <h5><b>Above the line</b></h5>
                      <p>By numbering at least <b>6</b> of these boxes in the order of your choice (with number 1 as your first choice).</p>
                    </div>
                  </Card>
                </Col>
                {/* <Slider {...sliderSettings}> */}
                <Col md={11}>
                  <Card style={{border: "none"}}>
                    <Row>
                      <div style={{overflowX: "scroll", whiteSpace: "nowrap", borderRight: "1px solid black"}}>
                        {this.setupPartiesInput(this.state.parties)}
                      </div>
                    </Row>
                  </Card>
                </Col>
                {/* </Slider> */}
              </Row>
              <hr style={{border: "10px solid black"}} />
              <Row>
                <Col md={1}>
                  <Card style={{border: "none"}}>
                    <div style={{textAlign: "justify"}}>
                      <h5 style={{backgroundColor: "#212529", color: "white"}}><b>Or:</b></h5>
                      <h5><b>Below the line</b></h5>
                      <p>By numbering at least <b>12</b> of these boxes in the order of your choice (with number 1 as your first choice).</p>
                    </div>
                  </Card>
                </Col>
                <Col md={11} style={{overflowX: "auto"}}>
                 <Card style={{border: "none"}}>
                    <Row>
                      <div style={{overflowX: "scroll", whiteSpace: "nowrap", borderRight: "1px solid black"}}>
                        {this.setupCandidatesInput(this.state.candidates, this.state.parties)}
                      </div>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <hr />
              <Row>
                <Button type="submit" fullWidth variant="contained" color="primary" disabled={this.props.user.voted} className={buttonClasses.button}>Submit Vote</Button>
              </Row>
              <Row>
                <Button fullWidth variant="contained" color="secondary" className={buttonClasses.button} onClick={this.gotoHome}>Back to home</Button>
              </Row>
            </form>
          </Row>
        </BootstrapContainer>
        {/* Notification (Snackbar) */}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          onClose={() => this.setState({open: false})}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          autoHideDuration={5000}
        >
          <MySnackbarContentWrapper
            onClose={() => this.setState({open: false})}
            variant="error"
            message="Invalid vote"
          />
        </Snackbar>
      </div>
    );
  }
}

export default Vote;

/**** AEC Practise Vote
 * Link: https://www.aec.gov.au/Voting/How_to_vote/practice/practice-senate.htm
 */