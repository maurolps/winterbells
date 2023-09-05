import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';

const firebaseConfig = {
 //...
}; 
const app = initializeApp(firebaseConfig); 
const db = getFirestore();

const UpdateDisplay = (() => {

 const updateDayLeft = () => {
   const daysLeft = document.getElementById('days-left');
   const myDate = new Date();
   const day = myDate.getDate();
   const month = myDate.getMonth() + 1;
   const year = myDate.getFullYear();
   let daysCounter = day;
   for (let i = month; i < 13; i++) {
     let daysInMonth = new Date(year, i, 0).getDate();
     if (i == month){
       daysCounter = daysInMonth - daysCounter;
     } else {
       if (i==12) { 
         daysInMonth = 25 
       }
       daysCounter += daysInMonth;
       if (i >= 15) {
         console.log ("ERROR. Months counter overloaded.");  
         return null;
       }
     }
   }
   daysLeft.textContent = `${daysCounter} DAYS`;
 }

 return {updateDayLeft}

})()
//day = user.data().Date.toDate().getDate() -- 5
//month = user.data().Date.toDate().getMonth() -- 8 (+1 = 9)
//year = user.data().Date.toDate().getFullYear() -- 2023
//GIBRALTAR HAVE SEEN THE LIGHTS IN - '03 • '06 • '11
async function readDB() {
  try {
    const userList = collection(db, 'userlist');
    const data = await getDocs(userList);
    data.forEach((user) => {
      console.log(user.data().Name, '=>', user.data().Date.toDate().getFullYear());    
      
    });
  } catch (error) {
    console.error('Error: ', error); 
  }
}

UpdateDisplay.updateDayLeft();
readDB();