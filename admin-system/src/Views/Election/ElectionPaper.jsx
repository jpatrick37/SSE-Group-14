import React, { Component } from 'react';
import NavBar from '../NavBar.jsx';
import { Container, Row, Col, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { firebase } from '../../Firebase.jsx';

// displalys what the voting paper would look like to voters
class ElectionPaper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parties: {},
            candidates: [],
            data: [],
        };
        // refrence to the firebase database
        this.candidatesRef = firebase.firestore().collection('candidates');
    }

    // runs when the firebase database changes
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
        this.setState({ candidates, parties })
    }

    // runs when the componet first mounts
    componentDidMount() {
        this.unsubscribe = this.candidatesRef.onSnapshot(this.onCandidatesCollectionUpdate);
    }

    // setups the parties to be displayed
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

    // sets up the candidates to be disaplyed
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



    render() {
        return (
            <div style= {{width: "100%"}}>
                {/* displays the Nav bar */}
            <NavBar {...this.props} activeItem='election' />

            {/* The voting paper */}
            <Container fluid>
                <Row>
                <Col>
                    <h1>Voting paper</h1>
                    <hr />
                </Col>
                </Row>
                <Row>
                <form >
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
