import React, { Component } from 'react';
import { Container, Row, Col, FormGroup, FormLabel, FormControl, Button } from 'react-bootstrap';
import { firebase } from '../Firebase.jsx';

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
        var candidateKey = (parties[key][j].SURNAME+'-'+parties[key][j].GIVEN_NAMES).toLowerCase();
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
    if (id.indexOf("party") !== -1) {
      vote.parties[id] = value;
    } else {
      vote.candidates[id] = value;
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
        <Col key={uniqueKey+"-formgroup"}>
          <FormGroup>
            <FormLabel>{key}</FormLabel>
            <FormControl as="select" id={uniqueKey}>
              {inputOptions}
            </FormControl>
          </FormGroup>
        </Col>
      );
    });
    return inputs;
  }

  setupCandidatesInput = (candidates, parties) => {
    var inputs = Object.keys(parties).map(function (key) {
      var candidatesInputs = [];
      for (var i=0; i<parties[key].length; i++) {
        // Unique Key
        var uniqueKey = (parties[key][i].SURNAME+"-"+parties[key][i].GIVEN_NAMES).toLowerCase();
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
              <FormLabel>{parties[key][i].SURNAME+" "+parties[key][i].GIVEN_NAMES}</FormLabel>
              <FormControl as="select" id={uniqueKey}>
                {inputOptions}
              </FormControl>
            </FormGroup>
          </Row>
        );
      }
      // Returning
      return (
        <Col key={key.replace(/\s/g,'-').toLowerCase()+"-candidates-cols"}>
          {candidatesInputs}
        </Col>
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
    // console.log(this.state.candidates, this.state.parties, this.state.vote);
    return (
      <div className="App">
        <Container fluid>
          <Row>
            <Col>
              <h1>Voting</h1>
              <hr />
            </Col>
          </Row>
          <Row>
            <form onChange={this.handleVoteFormChange} onSubmit={this.handleVoteSubmit}>
              {/* Generating parties input */}
              <Row>
                {this.setupPartiesInput(this.state.parties)}
              </Row>
              <hr />
              <Row>
                {this.setupCandidatesInput(this.state.candidates, this.state.parties)}
              </Row>
              <Row>
                <Button variant="success" type="submit" block>Submit Vote</Button>
              </Row>
            </form>
          </Row>
        </Container>
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