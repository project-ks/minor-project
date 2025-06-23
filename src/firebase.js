// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// import 'dotenv/config';

const api_key = process.env.REACT_APP_API_KEY;
const project_id=process.env.REACT_APP_PROJECT_ID;
const storage_bucket=process.env.REACT_APP_STORAGE_BUCKET;
const messaging_sender_id=process.env.REACT_APP_MESSAGING_SENDER_ID;
const app_id=process.env.REACT_APP_APP_ID;
const measurement_id=process.env.REACT_APP_MEASUREMENT_ID;


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: api_key,
  // authDomain: auth_domain,
  authDomain: "budget-tracker-af7e6.firebaseapp.com",
  projectId: project_id,
  storageBucket: storage_bucket,
  messagingSenderId: messaging_sender_id,
  appId: app_id,
  measurementId: measurement_id
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };