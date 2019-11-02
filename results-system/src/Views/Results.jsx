import React, { Component } from 'react';
import { Row, Col, FormGroup, FormLabel, FormControl, Container as BootstrapContainer, Card, Image } from 'react-bootstrap';

import { getResults } from '../Functions/getResults'
import logo from '../assets/images/ausgovlogo.png'

import ReactLoading from 'react-loading';

const numberingStyle = {
		color: "white",
		fontSize: "1.5rem",
		fontWeight: "bold",
		// position: "absolute",
		top: "0",
		width: "75px",
		background: "black",
		//borderRadius: "50%",
		textAlign: "center",
		boxShadow: "1px 1px 0 #999",
		float: "left",
};

class Results extends Component {
  constructor(props) {
    super(props);
	this.state = {
		elected_candidates: [],
		number_of_votes: 0,
		loading: true
	}
  }
  
  componentDidMount() {
	getResults().then(result =>{
		let resultObject = JSON.parse(result.message)
		console.log(resultObject)
		let number_of_votes = 0
		let elected_candidates = resultObject.map(candidate => {
			number_of_votes += candidate.first_pref_votes.length
			return {
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
	
	// All hardcoded variables for now
	var elected_candidates = [];
	elected_candidates.push({total_votes: 2,
						 elected: false,
						 excluded: false,
						 first_pref_votes: [],
						 name: "Jon",
						 party: "Pool Party"});
	elected_candidates.push({total_votes: 3,
						 elected: false,
						 excluded: false,
						 first_pref_votes: [],
						 name: "Ana",
						 party: "Disco Party"});
	elected_candidates.push({total_votes: 6,
						 elected: false,
						 excluded: false,
						 first_pref_votes: [],
						 name: "Bob",
						 party: "Pool Party"});
	elected_candidates.push({total_votes: 6,
						 elected: false,
						 excluded: false,
						 first_pref_votes: [],
						 name: "Tim",
						 party: "Single Party"});
	elected_candidates.push({total_votes: 5,
						 elected: false,
						 excluded: false,
						 first_pref_votes: [],
						 name: "Kat",
						 party: "Pool Party"});
	elected_candidates.push({total_votes: 4,
						 elected: false,
						 excluded: false,
						 first_pref_votes: [],
						 name: "Jen",
						 party: "Disco Party"});
	
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
		// Record Data for pie chart
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
    // console.log(this.state.candidates, this.state.parties, this.state.vote);
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
				{this.printElectedCandidates(this.elected_candidates, this.state.number_of_votes)}
			</BootstrapContainer>
			
		</div>
    );
  }
}
  
export default Results;