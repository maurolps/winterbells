import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js';

const firebaseConfig = {
apiKey: "AIzaSyD6VlTT23jbJjfnf65kjypcdtHlt8oNRI8",
authDomain: "winterbelss-e58ef.firebaseapp.com",
projectId: "winterbelss-e58ef",
storageBucket: "winterbelss-e58ef.appspot.com",
messagingSenderId: "387239747463",
appId: "1:387239747463:web:1904f16d989b0a82fc3d22",
measurementId: "G-3FD72ZST5R"
};

const app = initializeApp(firebaseConfig); 
const db = getFirestore(app);

const UpdateDisplay = (() => {
  const myDate = new Date();
  const day = myDate.getDate();
  const month = myDate.getMonth() + 1;
  const year = myDate.getFullYear();

 const updateDayLeft = () => {
  const daysDefault = document.querySelectorAll('.js-daysDefault');
  const daysContainer = document.getElementById('days-container');
  const daysDigit = document.createElement('span');
  daysDigit.className = "js-daysDefault font-['revans'] text-6xl bg-red-700 text-white relative h-20 w-16";
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
       if (i >= 14) {
         console.error ("Months counter overloaded.");  
         return null;
       }
     }
   }

   daysDefault.forEach((defaultDays) => { 
    defaultDays.remove();  
  });
  daysCounter = daysCounter.toString();
  for (let i = 0; i < daysCounter.length; i++) {
    if (i > 4) {return}
    daysDigit.textContent = daysCounter[i];
    daysContainer.appendChild(daysDigit.cloneNode(true));
  }
 }

 const updateUserList = (userName, userDate) => {
  const userList = document.querySelector('.user-list-container');
  const defaultList = document.querySelectorAll('.user-list');
  const userListDB = document.querySelector('.user-list-db');
  const newUserData = document.createElement('p');

  const classDot = '<span class="text-sm text-red-500">✦</span>';
  const className = `<span class="text-base uppercase text-red-700">${userName}</span>`
  const classText = '<span class="text-gray-600 text-sm italic"> looked at the sky in — </span>'
  const classDate = `<span class="text-xs"> ${userDate} </span>`;

  newUserData.className = "text-left md:text-right";
  newUserData.innerHTML = classDot + className + classText + classDate;
  
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
  const updateXmasCounter = () => {
    const xmasCounterDiv = document.getElementById("xmas-counter");
    const xmasCounterText = document.getElementById("xmas-counterText");

    const appDay = 24, 
    appMonth = 12, 
    appYear = 2000;

    let xmasCounter = year - appYear;
    let appDate = `${appDay}/${appMonth}/${appYear}`;
    let appYears =  0;
    let appMonths = month;
    let appDays = appMonths * 30;
    if (xmasCounter > 1) { 
      appYears =  xmasCounter - 1;
      appMonths = appYears * 12;
      appDays = (appDays * 30) + 7;
    }
    xmasCounterDiv.textContent = `${xmasCounter}`;
    xmasCounterText.textContent = `${appYears} years, ${appMonths} months, ${appDays} days since ${appDate}`  
 } 

 return {updateDayLeft, updateUserList, updateXmasCounter}

})()

function showStatus (message, type) { 
  const messageText = document.querySelector(".status-message");
  let timer1;
  console.log("adding active status to message: ", messageText)
  
  switch (type) {
    case "error": {
      messageText.classList.remove("success");
      messageText.classList.add("error");
      break;
    }
    case "success": {
      messageText.classList.remove("error");
      messageText.classList.add("success");
      break;
    }
  }
  messageText.textContent = message;
  messageText.classList.add("active");

  timer1 = setTimeout(() => {
    messageText.classList.remove("active");
  }, 5000); 

}

async function readDB() {
  try {
    const userList = collection(db, 'userlist'); 
    const data = await getDocs(userList);
    data.forEach((user) => {
      let userName = "";
      let day = user.data().Date.toDate().getDate();
      let month = user.data().Date.toDate().getMonth() + 1;
      const year = user.data().Date.toDate().getFullYear();

      day = String(day).padStart(2, '0');
      month = String(month).padStart(2, '0');
      userName = user.data().Name.toUpperCase();
      UpdateDisplay.updateUserList(userName, `'${day} • '${month} • '${year}`);
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
      showStatus(`${userName} have seen the lights`, "success");
      readDB();
    })
    .catch((error) => {
      showStatus("Server closed. Come back on December 24th", "error");
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
UpdateDisplay.updateXmasCounter();
readDB();
