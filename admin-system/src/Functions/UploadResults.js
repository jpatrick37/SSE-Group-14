 
import { firebase } from '../Firebase';

export async function uploadResult(result){
    console.log(result)
    var resultJson = JSON.stringify(result);
    firebase.firestore().collection("result").add({result: resultJson});
}

