 
import { firebase } from '../Firebase';

export async function uploadResult(result){
    console.log("result" + result)
    var resultJson = JSON.stringify(result);
    firebase.firestore().collection("result").doc("results").set({result: resultJson}).then(doc => {
        console.log(doc)
    });
    
}

