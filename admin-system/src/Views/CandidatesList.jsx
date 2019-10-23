import React, { Component } from 'react';
import { firebase } from '../Firebase.jsx';
import { Header, Card } from 'semantic-ui-react'
import ReactLoading from 'react-loading';
import NavBar from "./NavBar"
import '../css/candidatesListCard.css'

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
    var items = this.convertToList(parties)
    this.setState({ candidates, parties, items });
  }

  convertCandidateToContent(candidate){
    return(
      <div>
        <Header as='h6'>Given Name: {candidate["GIVEN_NAMES"]} <br /> SurName: {candidate["SURNAME"]}</Header>
      </div>
    )
  }
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

  componentDidMount() {
    this.unsubscribe = this.candidatesRef.onSnapshot(this.onCandidatesCollectionUpdate);
  }

  buildListCards(items){
    var cards = []
  
    for (let i = 0; i < items.length; i++){
      let party = []
      console.log(items[i])
      party.push(
                    <Card.Content header={items[i][0]['party'].trim()} />
                )
      let candidates = []
      for (let j = 0; j < items[i].length; j++){
        candidates.push(
                        <Card.Content extra>
                          {items[i][j]['content']}
                        </Card.Content>
        )
      }
      cards.push( <Card>
                    {party}
                    {candidates}
                  </Card>
      )
    }
    return cards
  }
  render() {
    if (!this.state.items){
      return <ReactLoading type="bubbles" color="blue" height={667} width={375} />
    }
    // console.log(this.state.candidates, this.state.parties, this.state.vote);
    console.log(this.state.items)
    return (
      <div>
        <NavBar {...this.props} activeItem='candidates' />
        <Card.Group style={{margin: '5px'}}>
          {this.buildListCards(this.state.items)}
        </Card.Group>
      </div>
    );
  }
}

export default CandidatesList;
