import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyCWFyJVkt2L-WjMsIPELlfFyDSrDr8R27w",
    authDomain: "medics-e502d.firebaseapp.com",
    projectId: "medics-e502d",
    storageBucket: "medics-e502d.appspot.com",
    messagingSenderId: "792318355239",
    appId: "1:792318355239:web:580888facc59f170416b02",
    measurementId: "G-NCLT4XV8Z5"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export {auth, db};