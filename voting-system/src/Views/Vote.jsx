import React, { Component } from 'react';
// import { firebase } from '../Firebase.jsx';

class Vote extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="App">
        <h1>Voting</h1>
        <hr />
        <p>Vote for something</p>
      </div>
    );
  }
}

export default Vote;

/**** Voting HAML Script - For reference
 * Link: https://www.aec.gov.au/Voting/How_to_vote/practice/practice-senate.htm
 * 
 * %h1{ class: "font-weight-bold" } Voting
 * %hr{ class: "border" } 
 * %br
 * - flash.each do |key, value|
 *   = content_tag :div, value, class: "flash #{key}"
 * 
 * = form_tag vote_index_path do
 * 
 *   %hr{ class: "border" }
 *   %div{ class: "container" }
 *     %div{ class: "row" }
 *       %div{ class: "col col-sm-2 border-right"}
 *         %h3{ class: "font-weight-bold" }You may vote in one of two ways
 *         %h3{ class: "font-weight-bold bg-container" }Either:
 *         %h3{ class: "font-weight-bold" }Above the line
 *         %p By numbering at least 6 of these boxes in the order of your choice (with number 1 as your first choice)
 *       %div{ class: "col" }
 *         %div{ class: "row" }
 *           - Candidate.all_parties.each_with_index do |current_party, i|
 *             %div{ class: "col-sm-2 mb-2 border-right border-left" }
 *               %div{ class: "col" }
 *                 = label :vote, current_party.to_sym, current_party
 *               %div{ class: "col" }
 *                 = number_field :vote, current_party
 *   %br
 *   %hr{ class: "border" }
 *   %div{ class: "container-fluid"}
 *     %div{ class: "row flex-row flex-nowrap" }
 *       %div{ class: "col col-sm-2 border-right" }
 *         %div{ class: "card card-block"}
 *           %h3{ class: "font-weight-bold bg-container" } Or:
 *           %h3{ class: "font-weight-bold" } Below the line
 *           %p By numbering at least 12 of these boxes in the order of your choice (with number 1 as your first choice).
 *       - Candidate.all_parties.each do |current_party|
 *         %div{ class: "col-3 border-right border-left" }
 *           %div{ class: "card card-block"}
 *             %h3{ class: "font-weight-bold" } #{current_party}
 *             - Candidate.where(party: current_party).each_with_index do |c, i|
 *               %div{ class: "row mb-2" }
 *                 %div{ class: "col mb-2" }
 *                   = label :vote, (i.to_s+current_party).to_sym, c.get_info
 *                 %div{ class: "col mb-2" }
 *                   = number_field :vote, (i.to_s+current_party)
 *   %br
 *   %hr{ class: "border" }  
 *   %p= submit_tag 'Submit vote', class: "btn btn-default"
 *       
 * %p= link_to 'Back to the Home page', home_index_path, class: "btn btn-default"
 */