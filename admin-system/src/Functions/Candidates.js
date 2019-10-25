
import React from 'react';
import { Header, Card } from 'semantic-ui-react'
// builds the list of cards for the candidates and parties into html
export function buildCandidatesPartiesCards(items){
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
  

// converts parties to an array list
export function convertPartiesToList(parties){
    var items = []
    let i = 0
    for (var party in parties){
      items[i] = []
      for (let j = 0; j < parties[party].length; j++){
        let candidate = parties[party][j]
        items[i].push({id: candidate['id'], content: convertCandidateToContent(candidate), party: candidate['PARTY']})
      }
      i = i + 1
    }
    return items
  }


// converts a candate to html header
function convertCandidateToContent(candidate){
return(
    <div>
    <Header as='h6'>Given Name: {candidate["GIVEN_NAMES"]} <br /> SurName: {candidate["SURNAME"]}</Header>
    </div>
)
}