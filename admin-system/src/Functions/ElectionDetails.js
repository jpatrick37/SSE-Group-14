 
import { firebase } from '../Firebase';
export async function getElectionTime(){
    // refrence to the database
    let electionCollection = firebase.firestore().collection("electionDetails")
    // refrence to the spefic 'table' in firebase
    let timeDetailsRef = electionCollection.doc("electionTime");
    
    var result = {}
    // get data from 'table'
    await timeDetailsRef.get().then(doc => {
        if (doc.exists){
            // get data
            let data = doc.data()
            
            // convert to javascript date objects
            let startTimeDateObject = new Date(data['startTime']['seconds'] *1000)
            let endTimeDateObject = new Date(data['endTime']['seconds'] * 1000)
            
            // convert to string
            let startTime = convertDateToString(startTimeDateObject)
            let endTime = convertDateToString(endTimeDateObject)
            // set the new start and end time as well as stop the loading component
            result =  {error: false, message: {startTime: startTime, endTime: endTime}}
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


// converts a javascript date to a string of format dd-mm-yyy HH:MM
function convertDateToString(date) {
    if (!date){
        return ""
    }
    let dateString = ""
    dateString += date.getDate()
    dateString += "-" + (date.getMonth() + 1) 
    dateString += "-" + date.getFullYear()
    dateString += " " + date.getHours()
    dateString += ":" + date.getMinutes()
    return dateString
  }

// converts a string with format dd-mm-yyy HH:MM into a date object
export function convertStringToDate(input){
    if (input == ""){
        return new Date()
    }
    let splitArr = input.split("-").map(item => item.trim());
    let day = splitArr[0]
    let month = splitArr[1]

    let yearTime = splitArr[2].split(" ").map(item => item.trim());
    let year = yearTime[0]
    let time = yearTime[1]
    let timeSplit = time.split(":").map(item => item.trim());
    let hours = timeSplit[0]
    let minutes = timeSplit[1]

    let date = new Date(year, parseInt(month - 1), day)
    date.setHours(hours)
    date.setMinutes(minutes)
    return date;
  }