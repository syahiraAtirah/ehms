// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyASYsws0cSDAqXY2iVjKlwOveRLnrf6ZkI",
    authDomain: "e-halaqah.firebaseapp.com",
    projectId: "e-halaqah",
    storageBucket: "e-halaqah.appspot.com",
    messagingSenderId: "135066083937",
    appId: "1:135066083937:web:faac30b6a7a68d93f48020",
    measurementId: "G-66ET2BYL5M"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const secondaryApp = firebase.initializeApp(firebaseConfig, "secondary");

const auth = firebase.auth();
const db = firebase.firestore();
