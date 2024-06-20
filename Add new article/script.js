import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, setDoc,getDocs, doc, Timestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";



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
const db = getFirestore(app);


const articleForm = document.getElementById('articleForm');

articleForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const shortDesc = document.getElementById('shortDesc').value;
    const speciality = document.getElementById('speciality').value;
    const subspeciality = document.getElementById('subspeciality').value;
    const article = document.getElementById('article').value;
    
    // Initial values for rates and raters
    const rates = 0;
    const raters = {};

    try {
        // Get the current date/time
        const currentDate = Timestamp.now();

        // Get the next available document ID based on current count
        const querySnapshot = await getDocs(collection(db, 'articles'));
        const articleCount = querySnapshot.size + 1;
        const articleId = `article${articleCount}`;

        // Set document with custom ID and current date
        await setDoc(doc(db, 'articles', articleId), {
            title: title,
            shortDesc: shortDesc,
            speciality: speciality,
            subspeciality: subspeciality,
            article: article,
            rates: rates,
            raters: raters,
            date: currentDate // Add current date/time to the document
        });

        console.log('Document written with ID: ', articleId);
        alert('Article added successfully!');
        // Optionally reset the form after successful submission
        articleForm.reset();
    } catch (e) {
        console.error('Error adding document: ', e);
        alert('Error adding article!');
    }
});