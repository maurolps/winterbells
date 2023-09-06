import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';

const firebaseConfig = {
// ...
}; 

const app = initializeApp(firebaseConfig); 
const db = getFirestore(app);

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

 const updateUserList = (userData) => {
  const userList = document.querySelector('.user-list-container');
  const defaultList = document.querySelectorAll('.user-list');
  const userListDB = document.querySelector('.user-list-db');
  const newUserData = document.createElement('p');

  newUserData.className = "text-center md:text-left";
  newUserData.textContent = userData.toUpperCase();
  
  defaultList.forEach((defaultlist) => {
    defaultlist.remove();
  });

  if (!userListDB) {
    const newUserList = document.createElement('div');
    newUserList.className = "user-list-db";
    newUserList.appendChild(newUserData);
    userList.appendChild(newUserList);
  } else {
    userListDB.appendChild(newUserData);
  }
  
  

 } 

 return {updateDayLeft, updateUserList}

})()

function messageBox (message) { 
  const messageBox = document.querySelector(".messageBox"),
  closeIcon = document.querySelector(".close"),
  messageText = document.querySelector(".text-2"),
  progress = document.querySelector(".progress");
  let timer1, timer2;

  messageText.textContent = message.toUpperCase();
  messageBox.classList.add("active");
  progress.classList.add("active");

  timer1 = setTimeout(() => {
    messageBox.classList.remove("active");
  }, 3000);

  timer2 = setTimeout(() => {
    progress.classList.remove("active");
  }, 3300);


closeIcon.addEventListener("click", () => {
  messageBox.classList.remove("active");

  setTimeout(() => {
    progress.classList.remove("active");
  }, 300);

  clearTimeout(timer1);
  clearTimeout(timer2);
});

}

async function readDB() {
  try {
    const userList = collection(db, 'userlist'); 
    const data = await getDocs(userList);
    data.forEach((user) => {
      let userData = "";
      let day = user.data().Date.toDate().getDate();
      let month = user.data().Date.toDate().getMonth() + 1;
      const year = user.data().Date.toDate().getFullYear();

      day = String(day).padStart(2, '0');
      month = String(month).padStart(2, '0');
      userData = `${user.data().Name} HAVE SEEN THE LIGHTS IN - '${day} • '${month} • '${year}`;
      UpdateDisplay.updateUserList(userData);
    });
  } catch (error) {
    console.error('Error: ', error);
  }
}

function writeDB () {

   const userName = document.getElementById('checkin').value; 
   const userList = collection(db, 'userlist');
   const myDate = new Date();

   addDoc(userList, {
    Name: userName,
    Date: myDate,
   })
    .then(() => {
      messageBox(`${userName} HAVE SEEN THE LIGHTS`);
    })
    .catch((error) => {
      console.error('Error: ', error);
    })
 

}

const formListener = (() => {
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    writeDB();
    form.reset();
  })
})();

UpdateDisplay.updateDayLeft();
readDB();