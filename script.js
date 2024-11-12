import { loadDB, saveDB } from './db.js';
//const isXmas = true;

const UpdateDisplay = (() => {
  const myDate = new Date();
  const day = myDate.getDate();
  const month = myDate.getMonth() + 1; // month is zero based
  const year = myDate.getFullYear();
  const appDate = '2023-12-24';
  const appDateStr = '24/12/2023'
  const isXmas = (day === 24 && month === 12) || (day === 25 && month === 12);

  console.log(day, month, year);
  if (isXmas) {
    const xmasTitle = document.getElementById('xmas-title');
    xmasTitle.textContent = 'MERRY CHRISTMAS';

    const xmasSubTitle = document.getElementById('xmas-subtitle');
    xmasSubTitle.textContent = 'SANTA IS HERE';
    console.log('Merry Christmas!');
  }

  const updateXmasProgress = (progress) => {
    const progressLeft = Math.floor(Math.abs((progress - 1) * 100)).toString();
    const xmasProgress = document.getElementById('xmas-progress');
    xmasProgress.style.width = `${progressLeft}%`;
  }

  const xmasCounter = () => {
    const firstDate = new Date(appDate);
    const firstYear = firstDate.getFullYear();
    const firstMonth = firstDate.getMonth() + 1;
    const firstDay = firstDate.getDate();

    let years = year - firstYear;
    let months = month - firstMonth;
    let days = day - firstDay;

    if (months < 0) {
      years--;
      months += 12;
    }
    if (days < 0) {
      months--;
      days += new Date(year, month, 0).getDate();
    }

    return { years, months, days };
  }

  const updateDayLeft = () => {
    const daysDefault = document.querySelectorAll('.js-daysDefault');
    const daysContainer = document.getElementById('days-container');
    const daysDigit = document.createElement('div');
    const daysToXmas = 359;
    let progressToXmas = 1;

    if (isXmas) {
      const xmasDaysText = document.getElementById('xmas-days-text');
      daysContainer.style.display = 'none';
      xmasDaysText.style.display = 'none';
      updateXmasProgress(10);
      return null;
    }

    daysDigit.className = "js-daysDefault font-['arial'] text-6xl bg-red-700 text-white flex justify-center items-center h-20 w-16 ";
    let daysCounter = day;

    for (let i = month; i < 13; i++) {
      let daysInMonth = new Date(year, i, 0).getDate();
      if (i == month) {
        daysCounter = daysInMonth - daysCounter;
      } else {
        if (i == 12) {
          daysInMonth = 25
        }
        daysCounter += daysInMonth;
        if (i >= 14) {
          console.error("Months counter overloaded.");
          return null;
        }
      }
    }

    daysDefault.forEach((defaultDays) => {
      defaultDays.remove();
    });

    progressToXmas = daysCounter / daysToXmas;
    updateXmasProgress(progressToXmas);
    daysCounter = daysCounter.toString();
    for (let i = 0; i < daysCounter.length; i++) {
      if (i > 4) { return }
      daysDigit.innerHTML = `<span className="">${daysCounter[i]}</span>`;
      daysContainer.appendChild(daysDigit.cloneNode(true));
    }
  }

  const updateUserList = (userName, userDate) => {
    const userList = document.querySelector('.user-list-container');
    const defaultList = document.querySelectorAll('.user-list');
    const userListDB = document.querySelector('.user-list-db');
    const newUserData = document.createElement('p');

    const classDot = '<span class="text-sm text-red-500">✦</span>';
    const className = `<span class="text-base lowercase text-red-700">${userName}</span>`
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

    const { years, months, days } = xmasCounter();

    xmasCounterDiv.textContent = `1`;
    xmasCounterText.innerHTML = `${years} years, ${months} months, ${days} days <br> since ${appDateStr}`
  }

  return { updateDayLeft, updateUserList, updateXmasCounter }

})()

function showStatus(message, type) {
  const messageText = document.querySelector(".status-message");
  let timer1;

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
  messageText.innerHTML = message;
  messageText.classList.add("fadeIn");
  messageText.classList.remove("fadeOut");

  timer1 = setTimeout(() => {
    messageText.classList.add("fadeOut");
    messageText.classList.remove("fadeIn");
  }, 3000);

}

function transformDate(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `'${day} • '${month} • '${year}`
}

async function readDB() {
  try {
    const data = await loadDB();

    data.forEach((user) => {
      const userDate = transformDate(user.data().Date.toDate());
      const userName = user.data().Name;
      UpdateDisplay.updateUserList(userName, userDate);
    });


  } catch (error) {
    console.error('Error: ', error);
  }
}

function writeDB() {

  const userName = document.getElementById('checkin').value;
  const myDate = new Date();
  const serverErrorMessage = `
                <span class="text-sm font-normal font-['Lora'] text-gray-600 ">
                <p>The lights are dim.</p>
                <p>Come back on <span id="tooltip-daysLeft" class="font-bold">Christmas</span> eve.</p>
</span>
`
  saveDB(userName, myDate)
    .then(() => {
      showStatus(`${userName} have seen the lights`, "success");
      UpdateDisplay.updateUserList(userName, transformDate(myDate));
    })
    .catch((error) => {
      showStatus(serverErrorMessage);
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
