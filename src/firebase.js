import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyClS-hVSovJK65_h-W8oqwXu6HmgGpNfUk",
    authDomain: "amfahh-amfahh.firebaseapp.com",
    projectId: "amfahh-amfahh",
    storageBucket: "amfahh-amfahh.appspot.com",
    messagingSenderId: "692844664487",
    appId: "1:692844664487:web:3753c0bed6b9fad9f42d82",
    measurementId: "G-55JJ4RW6JZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage }; 