import React, { Component } from 'react';
import { Row, Col, FormGroup, FormLabel, FormControl, Container as BootstrapContainer } from 'react-bootstrap';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { firebase } from '../Firebase.jsx';
import Slider from "react-slick";

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 12,
  slidesToScroll: 1,
  arrows: false,
};

class Vote extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      parties: {},
      candidates: [],
      data: [],
      vote: {},
    };
    this.candidatesRef = firebase.firestore().collection('candidates');
  }

  onCandidatesCollectionUpdate = (querySnapshot) => {
    // Variables
    var candidates = [];
    var parties = {};
    // Fetching
    querySnapshot.forEach(doc => {
      // Pushing to variables
      var candidate = doc.data();
      candidate.id = doc.id;
      candidates.push(candidate);
      if (Array.isArray(parties[candidate.PARTY])) {
        parties[candidate.PARTY].push(candidate);
      } else {
        parties[candidate.PARTY] = [candidate];
      }
    });
    // Storing in React State
    if (this._isMounted) {
      var vote = this.setupVoteObject(parties);
      this.setState({ candidates, parties, vote });
    }
  }

  setupVoteObject = (parties) => {
    var vote = { parties: {}, candidates: {} };
    var partyKeys = Object.keys(parties);
    for (var i=0; i<partyKeys.length; i++) {
      var key = partyKeys[i];
      var partyKey = partyKeys[i].toLowerCase().replace(/\s/g,'-');
      vote.parties[partyKey] = "-";
      for (var j=0; j<parties[key].length; j++) {
        var candidateKey = (parties[key][j].SURNAME+'-'+parties[key][j].GIVEN_NAMES+"-from-"+key.replace(/\s/g,'-')).toLowerCase();
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
    if (id.indexOf("-from-") !== -1) {
      vote.candidates[id] = value;
    } else {
      vote.parties[id] = value;
    }
    this.setState({ vote });
    // console.log(event.target.id, event.target.value);
  }

  setupPartiesInput = (parties) => {
    var inputs = Object.keys(parties).map(function (key) {
      var uniqueKey = key.replace(/\s/g,'-').toLowerCase();
      var inputOptions = [<option key={uniqueKey+"--"}>-</option>];
      for (var i=1; i<=Object.keys(parties).length; i++) {
        inputOptions.push(
          <option value={i} key={uniqueKey+"-option-"+i}>{i}</option>
        );
      }
      return (
        <div key={uniqueKey+"-formgroup"} style={{display: "inline-block", float: "none", height: "100%"}}>
          <Col md={8} style={{borderLeft: "1px solid black"}}>
            <BootstrapContainer>
              <FormGroup>
                <FormControl as="select" id={uniqueKey}>
                  {inputOptions}
                </FormControl>
                <br />
                <FormLabel><b>{key}</b></FormLabel>
              </FormGroup>
            </BootstrapContainer>
          </Col>
        </div>
      );
    });
    return inputs;
  }

  setupCandidatesInput = (candidates, parties) => {
    var inputs = Object.keys(parties).map(function (key) {
      var candidatesInputs = [];
      for (var i=0; i<parties[key].length; i++) {
        // Unique Key
        var uniqueKey = (parties[key][i].SURNAME+"-"+parties[key][i].GIVEN_NAMES+"-from-"+key.replace(/\s/g,'-')).toLowerCase();
        // Setting up options
        var inputOptions = [<option key={uniqueKey+"--"}>-</option>];
        for (var j=0; j<candidates.length; j++) {
          inputOptions.push(
            <option value={j} key={uniqueKey+"-option-"+j}>{j}</option>
          );
        }
        // Setting up candidates voting
        candidatesInputs.push(
          <Row key={uniqueKey+"-formgroup"}>
            <FormGroup>
              <Row>
                <Col md={4}>
                  <FormControl as="select" id={uniqueKey}>
                    {inputOptions}
                  </FormControl>
                </Col>
                <Col md={8}>
                  <p>{parties[key][i].SURNAME}</p>
                  <p>{parties[key][i].GIVEN_NAMES}</p>
                  <p><small>{key}</small></p>
                </Col>
              </Row>
            </FormGroup>
          </Row>
        );
      }
      // Returning
      return (
        <div key={key.replace(/\s/g,'-').toLowerCase()+"-candidates-cols"} style={{display: "inline-block", float: "none", borderLeft: "1px solid black"}}>
          <Col md={8}>
            <BootstrapContainer>
              <FormLabel><b>{key}</b></FormLabel>
              <hr />
              <br />
              {candidatesInputs}
            </BootstrapContainer>
          </Col>
        </div>
      );
    });
    return inputs;
  }

  checkVote = (vote) => {
    
  }

  handleVoteSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.vote);
  }

  render() {
    const buttonClasses = makeStyles(theme => ({
      button: {
        margin: theme.spacing(10),
      }
    }));
    return (
      <div className="App content">
        <BootstrapContainer style={{padding: "30px"}}>
          <Row>
            <Col>
              <h1>Voting</h1>
              <hr />
            </Col>
          </Row>
          <Row>
            <form onChange={this.handleVoteFormChange} onSubmit={this.handleVoteSubmit} style={{padding: "20px"}}>
              {/* Generating parties input */}
              <Row style={{overflowX: "auto"}}>
                <Col md={1}>
                  <div style={{textAlign: "justify"}}>
                    <h4><b>You may vote in one of two ways</b></h4>
                    <h4 style={{backgroundColor: "#212529", color: "white"}}><b>Either:</b></h4>
                    <h4><b>Above the line</b></h4>
                    <p>By numbering at least <b>6</b> of these boxes in the order of your choice (with number 1 as your first choice).</p>
                  </div>
                </Col>
                {/* <Slider {...sliderSettings}> */}
                <Col md={11}>
                  <Row>
                    <div style={{overflowX: "scroll", whiteSpace: "nowrap"}}>
                      {this.setupPartiesInput(this.state.parties)}
                    </div>
                  </Row>
                </Col>
                {/* </Slider> */}
              </Row>
              <hr style={{border: "10px solid black"}} />
              <Row>
                <Col md={1}>
                  <div style={{textAlign: "justify"}}>
                    <h4><b>Or:</b></h4>
                    <h4 style={{backgroundColor: "#212529", color: "white"}}><b>Below the line</b></h4>
                    <p>By numbering at least <b>12</b> of these boxes in the order of your choice (with number 1 as your first choice).</p>
                  </div>
                </Col>
                <Col md={11} style={{overflowX: "auto"}}>
                  <Row>
                    <div style={{overflowX: "scroll", whiteSpace: "nowrap"}}>
                      {this.setupCandidatesInput(this.state.candidates, this.state.parties)}
                    </div>
                  </Row>
                </Col>
              </Row>
              <hr />
              <Row>
                <Button type="submit" fullWidth variant="contained" color="primary" className={buttonClasses.button}>Submit Vote</Button>
              </Row>
            </form>
          </Row>
        </BootstrapContainer>
      </div>
    );
  }
}

export default Vote;

/**** Voting HAML Script - For reference
 * Link: https://www.aec.gov.au/Voting/How_to_vote/practice/practice-senate.htm
 * 
 * %h1{ class: "font-weight-bold" } Voting
 * %hr{ class: "border" } 
 * %br
 * - flash.each do |key, value|
 *   = content_tag :div, value, class: "flash #{key}"
 * 
 * = form_tag vote_index_path do
 * 
 *   %hr{ class: "border" }
 *   %div{ class: "container" }
 *     %div{ class: "row" }
 *       %div{ class: "col col-sm-2 border-right"}
 *         %h3{ class: "font-weight-bold" }You may vote in one of two ways
 *         %h3{ class: "font-weight-bold bg-container" }Either:
 *         %h3{ class: "font-weight-bold" }Above the line
 *         %p By numbering at least 6 of these boxes in the order of your choice (with number 1 as your first choice)
 *       %div{ class: "col" }
 *         %div{ class: "row" }
 *           - Candidate.all_parties.each_with_index do |current_party, i|
 *             %div{ class: "col-sm-2 mb-2 border-right border-left" }
 *               %div{ class: "col" }
 *                 = label :vote, current_party.to_sym, current_party
 *               %div{ class: "col" }
 *                 = number_field :vote, current_party
 *   %br
 *   %hr{ class: "border" }
 *   %div{ class: "container-fluid"}
 *     %div{ class: "row flex-row flex-nowrap" }
 *       %div{ class: "col col-sm-2 border-right" }
 *         %div{ class: "card card-block"}
 *           %h3{ class: "font-weight-bold bg-container" } Or:
 *           %h3{ class: "font-weight-bold" } Below the line
 *           %p By numbering at least 12 of these boxes in the order of your choice (with number 1 as your first choice).
 *       - Candidate.all_parties.each do |current_party|
 *         %div{ class: "col-3 border-right border-left" }
 *           %div{ class: "card card-block"}
 *             %h3{ class: "font-weight-bold" } #{current_party}
 *             - Candidate.where(party: current_party).each_with_index do |c, i|
 *               %div{ class: "row mb-2" }
 *                 %div{ class: "col mb-2" }
 *                   = label :vote, (i.to_s+current_party).to_sym, c.get_info
 *                 %div{ class: "col mb-2" }
 *                   = number_field :vote, (i.to_s+current_party)
 *   %br
 *   %hr{ class: "border" }  
 *   %p= submit_tag 'Submit vote', class: "btn btn-default"
 *       
 * %p= link_to 'Back to the Home page', home_index_path, class: "btn btn-default"
 */