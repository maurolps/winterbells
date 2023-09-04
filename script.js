const UpdateDisplay = (() => {

  const updateDayLeft = () => {
    const daysLeft = document.getElementById('days-left');
    const myDate = new Date();
    const day = myDate.getDate();
    const month = myDate.getMonth() + 1;
    const year = myDate.getFullYear();
    let daysCounter = day;
    for (i = month; i < 13; i++) {
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
    console.log(daysCounter);
    daysLeft.textContent = `${daysCounter} DAYS`;
  }

  return {updateDayLeft}

})()

UpdateDisplay.updateDayLeft();