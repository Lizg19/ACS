import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDS5X7gqfgjaXoH_9iIiOkC3JBoPlyjamQ",
  authDomain: "acertijo-app.firebaseapp.com",
  projectId: "acertijo-app",
  storageBucket: "acertijo-app.appspot.com",
  messagingSenderId: "414049041263",
  appId: "1:414049041263:web:1aeae345683f299731469a",
  measurementId: "G-YHR1LL8BP9"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default firestore;