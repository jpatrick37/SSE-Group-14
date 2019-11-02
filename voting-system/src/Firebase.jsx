import * as firebase from 'firebase';

let config = {
    apiKey: "AIzaSyAD6QSHeKfuXA2SNkegxmjFU7qKX2-7kpg",
    authDomain: "sse-group-14.firebaseapp.com",
    databaseURL: "https://sse-group-14.firebaseio.com",
    projectId: "sse-group-14",
    storageBucket: "",
    messagingSenderId: "561611230532",
    appId: "1:561611230532:web:c2150ee23865a02c33db11"
};

firebase.initializeApp(config);

var f = !firebase.apps.length ? firebase.initializeApp(config) : firebase.app()

// export default firebase;
export {
  f as firebase,
  config,
}