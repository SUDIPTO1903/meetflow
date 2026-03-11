import firebase from "firebase";

const firebaseConfig = {
  apiKey: "", // Add API Key
  databaseURL: "", // Add databaseURL
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const realtimeDb = firebase;

let presenceRootRef = firebase.database().ref();

export const displayName = prompt("What's your name?");

const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get("id");

if (roomId) {
  presenceRootRef = presenceRootRef.child(roomId);
} else {
  presenceRootRef = presenceRootRef.push();
  window.history.replaceState(null, "Meet", "?id=" + presenceRootRef.key);
}

export default presenceRootRef;
