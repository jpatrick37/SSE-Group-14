import React, { Component } from 'react';
import PieChart from 'react-minimal-pie-chart';
import { Container, Row, Col } from 'react-bootstrap';

import { getResults } from '../Functions/getResults'


class Results extends Component {
  constructor(props) {
    super(props);
	this.state = {
		parties: {'Pool': 'steve', 'Fire': 'litty', 'Savage': 'jeff'},
		candidates: ['steve', 'litty', 'jeff'],
		voteCounts: {'steve': 200, 'litty': 300, 'jeff': 260},
	};
  }

  convertResultsObjectToState(resultsObject){
	// console.log(resultsObject)

	// let parties = {}
	// resultsObject.map(candidate => {

	// })

	let candidates = resultsObject.map(candidate =>{
		let name = candidate.GIVEN_NAMES + " " + candidate.SURNAME
		return name
	})

	let voteCounts = resultsObject.map(candidate => {
		let key = candidate.GIVEN_NAMES + " " + candidate.SURNAME
		let voteCount = {[key]: candidate.first_pref_votes.length}
		return voteCount
	})

	console.log(candidates)
	console.log(voteCounts)
	this.setState({candidates, voteCounts})
  }
  
  componentDidMount() {
	getResults().then(result =>{
		let resultObject = JSON.parse(result.message)
		this.convertResultsObjectToState(resultObject)
	  })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  
  setupPartiesOutput = (parties, candidates, voteCounts) => {
	function precise(x) {
	  return Number.parseFloat(x).toPrecision(3);
	}
    var outputs = Object.keys(parties).map(function (key) {
	  // Iterate through parties
	  for (var i=0; i<Object.keys(parties).length; i++) {
		  // Create a unique key for each party
	      var uniqueKey = key.replace(/\s/g,'-').toLowerCase();
	  }
	  // Calculate total votes and totals for each party
	  var voteTotal = 0;
	  var partyTotal = 0;
	  var candidateResults = [];
	  for (var i = 0; i<candidates.length; i++){
		  voteTotal += voteCounts[candidates[i]];
		  if (candidates[i] == parties[key]){
			  partyTotal += voteCounts[candidates[i]];
			  candidateResults.push(
				  <Col>
					  <h5>{candidates[i]+": "+voteCounts[candidates[i]]}</h5>
				  </Col>
				);
	      }
	  }
	  candidateResults.push(
		  <Col>
			  <h5>{"Total: "+partyTotal}</h5>
		  </Col>
		);
      return (
	    <Container key={uniqueKey+"-resultgroup"}>
		  <Row>
			  <Col>
				<h3>{key+" Party"}</h3>
			  </Col>
			  <Col>
				<h3>{"Result: "+precise(100*partyTotal/voteTotal)+"%"}</h3>
			  </Col>
		  </Row>
		  <Row>
		    <Col>
		      <h5>Candidate Votes</h5>
			</Col>
			{candidateResults}
		  </Row>
		  <Row>
			<p></p>
		  </Row>
		  <hr />
		</Container>
      );
    });
    return outputs;
  }
	
  setupPieChart = (parties, candidates, voteCounts) => {
	function   generateRandomColor() {
		let r = Math.round((Math.random() * 255)); //red 0 to 255
		let g = Math.round((Math.random() * 255)); //green 0 to 255
		let b = Math.round((Math.random() * 255)); //blue 0 to 255
		return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    };
    var partyChart = [];
	var labels = [];
	var outputs = Object.keys(parties).map(function (key) {
	  // Calculate total votes and totals for each party
	  var voteTotal = 0;
	  var partyTotal = 0;
	  for (var i = 0; i<candidates.length; i++){
		  voteTotal += voteCounts[candidates[i]];
		  if (candidates[i] == parties[key]){
			  partyTotal += voteCounts[candidates[i]];
	      }
	  }
	  var partyColour = generateRandomColor();
	  labels.push(<p style={{color:partyColour}}>{key}</p>);
	  partyChart.push({ title: key, value: partyTotal, color: partyColour});
    });
	
    return (
		<Container>
		  <Col>
			<PieChart
				data={partyChart}
				label={props => { return props.data[props.dataIndex].title;}}
			/>
		  </Col>
		  <Col>
		    {labels}
		  </Col>
		</Container>
	);
  }
  
  render() {
	
    // console.log(this.state.candidates, this.state.parties, this.state.vote);
    return (
      <div className="App">
        <Container fluid>
          <Row>
              <h1>Results</h1>
              <hr />
          </Row>
          {this.setupPartiesOutput(this.state.parties, this.state.candidates, this.state.voteCounts)}
		  <Row>
		    <h2>Statistics</h2>
			{this.setupPieChart(this.state.parties, this.state.candidates, this.state.voteCounts)}
		  </Row>
        </Container>
      </div>
    );
  }
}
  
export default Results;