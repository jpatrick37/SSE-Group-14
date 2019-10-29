import React, { Component } from 'react';
import NavBar from '../NavBar.jsx';
import { Header, Button, Modal, Icon } from 'semantic-ui-react'
import { IoLogoBuffer, IoMdSad } from 'react-icons/io'
import { getVotes } from '../../Functions/GetVotes'
import LoadingSymbol from './../LoadingSymbol'

// helper functions
import { getElectionTime, convertStringToDate } from '../../Functions/ElectionDetails'
import { calculateElectedSenators } from '../../Functions/ClaculateResults'
import { getCandidates } from '../../Functions/GetCandidates'
import { uploadResult } from '../../Functions/UploadResults'

// calculates the results of the election
class CalculateResults extends Component {
  constructor(props) {
    super(props);
    this.state = {
        startTime: "",
        endTime: "",
        fetchingTime: true,
        warningOpen: false,
        fetchingVotes: true, 
        fetchingCandidates: true,
        calculatingResults: false,
        votes: null,
        candidates: null
    };
  }

  // runs when the componet mounts
  async componentDidMount(){
    getElectionTime().then(result => {
      let time = result['message']
      this.setState({
        startTime: time['startTime'],
        endTime: time['endTime'],
        fetchingTime: false
      })
    })
    
    getVotes().then(result =>{
      let votes = result['message']
      let voteArray = []
      for (var i = 0; i < votes.length; i++){
        voteArray.push(votes[i].belowTheLine)
      }
      console.log(voteArray)
      this.setState({
        votes: voteArray,
        fetchingVotes: false
      })
    })

    getCandidates().then(result =>{
      let candidates = result['message']

      // sort in ballot position order
      candidates = candidates.sort((a,b) => (parseInt(a.BALLOT_POSITION) > parseInt(b.BALLOT_POSITION)) ? 1 : ((parseInt(b.BALLOT_POSITION) > parseInt(a.BALLOT_POSITION)) ? -1 : 0)); 
      
      // adding fields for claculate function
      candidates.map(candidate =>{
        candidate.total_votes = 0
        candidate.elected = false
        candidate.excluded = false
        candidate.first_pref_votes = []
      })

      this.setState({
        candidates,
        fetchingCandidates: false
      })
    })    
  }

  // opens the prompt for editting
  openWarningMessage = () => {
    this.setState({ warningOpen: true });
  }
  
  // checks if the current time is after the inputted time
  isCurrenttimeAfter = (time) => {
    // ideally might want an api call to a time server(get curent time)
    let currentTime = new Date().getTime();
    console.log("Times")
    console.log(currentTime)
    console.log(time)
    // if the current time is after the election, they can calucate the results
    if(currentTime > time){
      return true
    }
    return false
  }

  // try to count the results, if successful set the loading bar to 100 and remove the warning 
  calculateResults = (value) => {
    if(value){
      // if the election is over
      if(this.isCurrenttimeAfter(convertStringToDate(this.state.endTime))){
        // voting counting starting
        this.setState({calculateResults: true, warningOpen: false})
        let numberOfSentors = 12
        console.log(numberOfSentors)

        let results = calculateElectedSenators(numberOfSentors+1, this.state.candidates, this.state.votes)
        console.log(results)

        // if voting had an error
        if(results === -1){
          // error
          console.log('error')
          this.setState({calculateResults: false})
          return
        }

        //vote counting ended
        this.setState({calculateResults: false})

        // upload result
        uploadResult(results)


      }
      else{
        console.log("can't count")
      }
      this.setState({warningOpen: false, loadingBarProgress: 100})
    }
    else{
      this.setState({warningOpen: false})
    }
  }

  render() {
    // if havn't fetched time display loading bar
    if(this.state.fetchingTime && this.state.fetchingVotes && this.state.fetchingCandidates){
      return <LoadingSymbol {...this.props} activeItem='results' />
    }

    // print election not over yet if the elction date hasn't finished
    if (!this.isCurrenttimeAfter(convertStringToDate(this.state.endTime))){
      return(
        <div style= {{width: "100%"}}>
          <NavBar {...this.props} activeItem='results' />
          <Header as='h1'>The Election is not over yet! </Header>
          <IoMdSad size="10em"/> <br />
        </div>
      )
    }
    // if claculating the results
    if(this.state.calculatingResults){
      return(
        <Header size='big' >Calculating Results</Header>,
        <LoadingSymbol {...this.props} activeItem='results' />
      )
    }

    return (
      <div style= {{width: "100%"}}>
        <NavBar {...this.props} activeItem='results' />
        <IoLogoBuffer color='red' size="10em"/> <br />
        <Button color='red' onClick={this.openWarningMessage}>Initiate the Counting</Button>

        {/* warning pop up shown if they want to claculate results */}
        <Modal open={this.state.warningOpen}  basic size='small'>
          <Header icon='archive' content='Counting the Votes' />
          <Modal.Content>
            <p>
              You are about to calculate the results of the election. Are you sure?
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color='grey' inverted onClick={() => this.calculateResults(false)}>
              <Icon name='remove' /> No
            </Button>
            <Button color='red' inverted onClick={() => this.calculateResults(true)}>
              <Icon name='checkmark' /> Yes
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}


export default CalculateResults;
