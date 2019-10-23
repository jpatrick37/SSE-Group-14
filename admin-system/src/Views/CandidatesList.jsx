import React, { Component } from 'react';
import { firebase } from '../Firebase.jsx';
import { Header, Card } from 'semantic-ui-react'
import ReactLoading from 'react-loading';
import NavBar from "./NavBar"
import '../css/candidatesListCard.css'

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
    var items = this.convertToList(parties)
    this.setState({ candidates, parties, items });
  }

  // converts a candate to html
  convertCandidateToContent(candidate){
    return(
      <div>
        <Header as='h6'>Given Name: {candidate["GIVEN_NAMES"]} <br /> SurName: {candidate["SURNAME"]}</Header>
      </div>
    )
  }
  // converts parties to an array list
  convertToList(parties){
    var items = []
    let i = 0
    for (var party in parties){
      items[i] = []
      for (let j = 0; j < parties[party].length; j++){
        let candidate = parties[party][j]
        items[i].push({id: candidate['id'], content: this.convertCandidateToContent(candidate), party: candidate['PARTY']})
      }
      i = i + 1
    }
    return items
  }

  // ran when component mounts
  componentDidMount() {
    this.unsubscribe = this.candidatesRef.onSnapshot(this.onCandidatesCollectionUpdate);
  }

  // builds the list of cards for the candidates and parties into html
  buildListCards(items){
    var cards = []

    // for each party
    for (let i = 0; i < items.length; i++){
      let party = []
      // add party to the card header
      party.push(
                    <Card.Content key={i + items[i][0]['party'].trim()}  header={items[i][0]['party'].trim()} />
                )
      let candidates = []
      // for each candidate
      for (let j = 0; j < items[i].length; j++){
        // add candate as an extra card content
        candidates.push(
                        <Card.Content key={i + j} extra>
                          {items[i][j]['content']}
                        </Card.Content>
        )
      }
      // make the card using the candidate and parties
      cards.push( <Card key={i}>
                    {party}
                    {candidates}
                  </Card>
      )
    }
    return cards
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
          {this.buildListCards(this.state.items)}
        </Card.Group>
      </div>
    );
  }
}

export default CandidatesList;
