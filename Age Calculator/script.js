var calculatebtn = document.getElementById('calculatebtn'),
current_Age = document.getElementById('current_Age');

var clearbtn = document.getElementById('clearbtn');

current_Age.style.display = 'none';

calculatebtn.addEventListener('click',function(){

  current_Age.style.display = 'block';

  var dob_date = document.getElementById('birthdate').value;
  dob_date = new Date(dob_date);
  //alert(dob_date)
  var todayDate = new Date();
  //alert(todayDate)
  totalAge = Date.now() - dob_date.getTime();
  ageYears = new Date(totalAge);
  ageYears = Math.abs(ageYears.getUTCFullYear() - 1970);

  function ageMonth(){
    if(todayDate.getMonth() >= dob_date.getMonth()){

      if(todayDate.getDate() >= dob_date.getDate()){
        return todayDate.getMonth() - dob_date.getMonth();
      }else{
        if((todayDate.getMonth() - 1) >= dob_date.getMonth()){
          return (todayDate.getMonth() - 1) - dob_date.getMonth();
        }else{
          return ((todayDate.getMonth() - 1) + 12) - dob_date.getMonth();
        }
      }
    }else{
      if(todayDate.getDate() >= dob_date.getDate()){
        return (todayDate.getMonth() + 12) - dob_date.getMonth();
      }else{
        return ((todayDate.getMonth() - 1) + 12) - dob_date.getMonth();
      }
    }
  }

  function ageDays(){
    if(todayDate.getDate() > dob_date.getDate()){
      return todayDate.getDate() - dob_date.getDate();
    }else if(todayDate.getDate() == dob_date.getDate()){
      return todayDate.getDate() - dob_date.getDate();
    }else{
      var calDate = new Date(dob_date.getFullYear(), dob_date.getMonth(),0);
      return (todayDate.getDate() + calDate.getDate()) - dob_date.getDate();
    }
  }

  current_Age.innerHTML = "Your Current Age is "+ ageYears + " Years, " + ageMonth() + " Month, and " + ageDays() + " Days ";
})

clearbtn.addEventListener('click',function(){
  current_Age.innerHTML = " ";
  clearInterval(current_Age);
  current_Age.style.display = 'none';
})