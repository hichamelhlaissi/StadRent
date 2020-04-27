import * as firebase from "firebase";
import '@firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBrYOM8z6ZwVZeduTQ98sY1KlkcwBW_lbI",
    authDomain: "stadiumrent.firebaseapp.com",
    databaseURL: "https://stadiumrent.firebaseio.com",
    projectId: "stadiumrent",
    storageBucket: "stadiumrent.appspot.com",
    messagingSenderId: "883002894442",
    appId: "1:883002894442:web:d87612cc26cf15df570213",
    measurementId: "G-3Q4C94Q1B4"
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const db = app.database();
export const storage = app.storage();
export const auth = app.auth();
export const firestoreDb = app.firestore();

