import { firebase } from '../Firebase.jsx';


// at least to 12 and max 22
export function submitVote(){
  let min = 12
  let max = 23

  let numberOfVotes = Math.floor((Math.random() * (max - min) + min))

// incase maths function doesn't work
  if(numberOfVotes < min || numberOfVotes > max){
    numberOfVotes = 15
  }

  let voteArray = []
  for(var i = 1; i <= max; i++){
    if(i > numberOfVotes){
      voteArray.push(0)
    }
    else{
      voteArray.push(i)
    }
  }

  let vote = {belowTheLine: shuffle(voteArray)}
  console.log(vote)
  

  firebase.firestore().collection("votes").add(vote);
}

function shuffle(arr) {
  var i,
      j,
      temp;
  for (i = arr.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
  }
  return arr;    
};

