// Written by Roland Croft
// Instructions to run are located in readme of main folder. 
// No input required. (But requires votes to have been submitted in the voting system. See voting-system for details.)
// Output is list of elected candidates. Each candidate details:
// Position in order of votes. 
// Name. 
// Affiliated Party. 
// Percentage of obtained votes. 

import React, { Component } from 'react';
import { Row, Col, FormGroup, FormLabel, FormControl, Container as BootstrapContainer, Card, Image } from 'react-bootstrap';

import { getResults } from '../Functions/getResults'
import logo from '../assets/images/ausgovlogo.png'

import ReactLoading from 'react-loading';

const numberingStyle = {
		color: "white",
		fontSize: "1.5rem",
		fontWeight: "bold",
		top: "0",
		width: "75px",
		background: "black",
		textAlign: "center",
		boxShadow: "1px 1px 0 #999",
		float: "left",
};

class Results extends Component {
  constructor(props) {
    super(props);
	// State attributes
	this.state = {
		elected_candidates: [],
		number_of_votes: 0,
		loading: true
	}
  }
  
  // On Mount, read attributes from the database
  componentDidMount() {
	getResults().then(result =>{
		let resultObject = JSON.parse(result.message)
		console.log(resultObject)
		let number_of_votes = 0
		// Get elected candidates
		let elected_candidates = resultObject.map(candidate => {
			// Record total number of votes
			number_of_votes += candidate.first_pref_votes.length
			return {
				// Record attributes of each elected candidate
				total_votes: candidate.first_pref_votes.length,
				name: candidate.GIVEN_NAMES + " " + candidate.SURNAME,
				party: candidate.PARTY
			}
		})
		this.setState({elected_candidates, number_of_votes, loading: false})
	  })
  }

  printElectedCandidates = (elected_candidates, all_votes) => {
	// Set significant figures
	function precise(x) {
	  return Number.parseFloat(x).toPrecision(3);
	}
	
	var output = [];
	// Convert objects into a sortable array
	var sortedCandidates = [];
	for (var i = 0; i < elected_candidates.length; i++) {
		sortedCandidates.push([elected_candidates[i].name, elected_candidates[i].party, elected_candidates[i].total_votes]);
	}
	// Sort elected candidates by vote count
	sortedCandidates.sort(function(a, b) {
		return b[2] - a[2];
	});
	
	// Output candidate details
	for (var i = 0; i < elected_candidates.length; i++) {
		output.push(
			<Row>
				<Col>
					<h5 style={numberingStyle}>{i+1}</h5>
				</Col>
				<Col>
					<h5>{sortedCandidates[i][0]}<br/>{sortedCandidates[i][1].toUpperCase()}</h5>
				</Col>
				<Col>
					<h5>{precise(100*sortedCandidates[i][2]/all_votes)}%</h5>
				</Col>

			</Row>
		);
		output.push(<hr />);
	}
	
    return (
		<div>
			{output}
		</div>
	);
  }
 
  render() {
	if(this.state.loading){
		return <ReactLoading type="bubbles" color="blue" height={667} width={375} />
	}
    return (
		<div className="App content">
			<BootstrapContainer style={{padding: "30px"}}>
				<Row>
					<Image src={logo} style={{maxHeight: "50px", float: "left", paddingRight: "30px"}}/>
					<h5 style={{textAlign: "justify", float: "right"}}> Senate Ballot Paper<br/><b>State</b> - Election of Senators</h5>
				</Row>
				<hr />
				<Row>
					<h2 style={{textAlign: "justify", float: "left"}}>Elected Candidates</h2>
				</Row>
				<hr />
				{this.printElectedCandidates(this.state.elected_candidates, this.state.number_of_votes)}
			</BootstrapContainer>
			
		</div>
    );
  }
}
  
export default Results;
