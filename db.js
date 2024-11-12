
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyAnMJCPT2xZQ_dAjeGrVBhUY3ouEVFC75g",
  authDomain: "winterbellsv.firebaseapp.com",
  projectId: "winterbellsv",
  storageBucket: "winterbellsv.firebasestorage.app",
  messagingSenderId: "357559005651",
  appId: "1:357559005651:web:76eb2168747d13c482ff26",
  measurementId: "G-2BL2RN74X3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function loadDB() {
  try {
    const userList = collection(db, 'userlist');
    const data = await getDocs(userList);
    return data;
  } catch (err) {
    throw err;
  }
}

export async function saveDB(userName, date) {
  const userList = collection(db, 'userlist');
  const data = await addDoc(userList, {
    Name: userName,
    Date: date
  });
  return data;
}
