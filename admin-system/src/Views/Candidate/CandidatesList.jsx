import React, { Component } from 'react';
import { firebase } from '../../Firebase.jsx';
import { Card } from 'semantic-ui-react'
import ReactLoading from 'react-loading';
import NavBar from "../NavBar"
import '../../css/candidatesListCard.css'

import { buildCandidatesPartiesCards, convertPartiesToList } from "../../Functions/Candidates"
// this class generates a list of parties and there candidates
class CandidatesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      parties: {},
      candidates: [],
      data: [],
      vote: {},
      items: null
    };
    // candidates refernce for getting information from the database
    this.candidatesRef = firebase.firestore().collection('candidates');
  }

  // when the database updates, it updates this page as well
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
    var items = convertPartiesToList(parties)
    this.setState({ candidates, parties, items });
  }


  // ran when component mounts
  componentDidMount() {
    this.unsubscribe = this.candidatesRef.onSnapshot(this.onCandidatesCollectionUpdate);
  }

  render() {
    // if getting data from the database, display the loading symbol
    if (!this.state.items){
      return <ReactLoading type="bubbles" color="blue" height={667} width={375} />
    }

    return (
      <div>
        {/* load the Nav Bar */}
        <NavBar {...this.props} activeItem='candidates' />
        {/* generate the cards using the items from the database */}
        <Card.Group style={{margin: '5px'}}>
          {buildCandidatesPartiesCards(this.state.items)}
        </Card.Group>
      </div>
    );
  }
}

export default CandidatesList;
