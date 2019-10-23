import React, { Component } from 'react';
import NavBar from './NavBar.jsx';
// import { Button } from 'semantic-ui-react'
import { Container, Row, Col, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { firebase } from '../Firebase.jsx';




class ElectionPaper extends Component {
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
        var vote = this.setupVoteObject(parties);
        this.setState({ candidates, parties, vote })
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
        this.unsubscribe = this.candidatesRef.onSnapshot(this.onCandidatesCollectionUpdate);
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
            <div style= {{width: "100%"}}>
            <NavBar {...this.props} activeItem='election' />
            <Container fluid>
                <Row>
                <Col>
                    <h1>Voting paper</h1>
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
                </form>
                </Row>
            </Container>
            </div>
        );
    }
}



export default ElectionPaper;
