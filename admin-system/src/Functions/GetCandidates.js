 
import { firebase } from '../Firebase';

export async function getCandidates(){

    var result = {}

    const electionCollection = await firebase.firestore().collection('candidates').get().catch(error => {
        console.log("Error getting document", error)
        result =  {error: true, message: "Error getting document"}
        return result
    })

    var document =  electionCollection.docs.map(doc => doc.data());

    result =  {error: false, message: document}

    return result
}

