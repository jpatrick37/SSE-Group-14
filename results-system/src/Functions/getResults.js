import { firebase } from '../Firebase';
export async function getResults(){
    // refrence to the database
    let electionCollection = firebase.firestore().collection("result")
    // refrence to the spefic 'table' in firebase
    let timeDetailsRef = electionCollection.doc("results");
    
    var result = {}
    // get data from 'table'
    await timeDetailsRef.get().then(doc => {
        if (doc.exists){
            // get data
            let data = doc.data()
            console.log(data)
            // set the new start and end time as well as stop the loading component
            result =  {error: false, message: data.result}
        } else {
            console.log("No Document Found")
            result = {error: true, message: "No document found"}
        }
        }).catch(error => {
        console.log("Error getting document", error)
        result =  {error: true, message: "Error getting document"}
    })
    return result
}