// nav bar email show function when the page loads

const allEmailFromTeam = [];
const allAttendeesEmailFromAtt = [];

const addMeeting = async (data) => {

   
  const raw = JSON.stringify(data);
  console.log(data);

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") },
    body: raw,
    redirect: "follow",
  };
  //console.log(requestOptions);
  const response = await fetch(`https://mymeetingsapp.herokuapp.com/api/meetings`, requestOptions);
  //console.log(response);
  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || "Some error occured");
  }

  // location.href = "login.html";
  // try{
  //   if (!response.ok) {
  //     const responseText = await response.text();
  //     throw new Error(responseText || "Some error occured");
  //   } else {
  //     alert("Regertered success");
  //     // location.href = "login.html";
  //   }
  // }catch(error){
  //  alert("cathc error");
  // }

  return response.json();
};

const showUserEmail = () => {
  const userEl = document.querySelector("#loged-in-user");
  let userDetails = localStorage.getItem("email");
  //console.log(userDetails);
  userEl.innerHTML = `Hello <span class="primary">${userDetails}</span>!`;
};

// this function used to check attendees  email valid or not
const isEmailValid = async (attendeesArr) => {
  const response = await fetch(`https://mymeetingsapp.herokuapp.com/api/users`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || "Some error occured");
  }
  const allUserdata = await response.json();
  // console.log("this data form fetch user ", allUserdata);

  //console.log("email validation runed");
  //console.log(attendeesArr);

  for (let i = 0; i < attendeesArr.length; i++) {
    if (attendeesArr[i][0] === "@") continue;
    let flag = true;
    for (let j = 0; j < allUserdata.length; j++) {
      if (attendeesArr[i] === allUserdata[j].email) {
        allAttendeesEmailFromAtt.push(attendeesArr[i]);
        flag = false;
        break;
      }
    }
    if (flag) return false;
  }
  return true;
};

// this function used to check whether the team is present or not

const isTeamValid = async (attendeesArr) => {
  const response = await fetch(`https://mymeetingsapp.herokuapp.com/api/teams`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || "Some error occured");
  }

  const allteamdata = await response.json();
  // console.log("this data form fetch team  ", allteamdata);
  //console.log("team validation runed");

  for (let i = 0; i < attendeesArr.length; i++) {
    if (attendeesArr[i][0] !== "@") continue;
    let flag = true;
    let team = attendeesArr[i].substring(1);
    for (let j = 0; j < allteamdata.length; j++) {
      if (team === allteamdata[j].shortName) {
        for (let k = 0; k < allteamdata[j].members.length; k++) {
          allEmailFromTeam.push(allteamdata[j].members[k].email);
        }
        flag = false;
        break;
      }
    }
    if (flag) return false;
  }
  return true;
};

// this function used to validate the attendees and team present in the server

const isAttendeesValid = async (attendees) => {
  const attendeesArr = attendees.split(",");
  for (let i = 0; i < attendeesArr.length; i++) {
    attendeesArr[i] = attendeesArr[i].trim();
  }
  // console.log("this data we got form the user  ", attendeesArr);

  const checkEmail = await isEmailValid(attendeesArr);
  if (!checkEmail) {
    alert("user with email not present ");
    return false;
  }

  const checkTeam = await isTeamValid(attendeesArr);
  if (!checkTeam) {
    alert("Team not Present");
    return false;
  }

  return true;
};

// this function will return the right format needed for the adding the data the meeting
const getDataInFormat = async (meetingData) => {
  // console.log("This=>",meetingData.attendeesArr);
  const correctDataOrder = {
    name: meetingData.name,
    description: meetingData.description,
    date: meetingData.date,
    startTime: {
      hours: parseInt(meetingData.startTime.substring(0, 2)),
      minutes: parseInt(meetingData.startTime.substring(3, 5)),
    },
    endTime: {
      hours: parseInt(meetingData.endTime.substring(0, 2)),
      minutes: parseInt(meetingData.endTime.substring(3, 5)),
    },
    attendees: meetingData.attendeesArr,
  };
  return correctDataOrder;
  //console.log("This is the final object", correctDataOrder);
};

// this methods takes all the data form the form
async function onAddMeetingSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value; //username
  const date = document.getElementById("date").value; //email
  const startTime = document.getElementById("start-time").value; //password
  const endTime = document.getElementById("end-time").value; //confirm password
  const description = document.getElementById("description").value;
  const attendees = document.getElementById("attendees").value;

  //console.log(name, date, startTime, endTime, description);

  //console.log(attendees);
  const isValidAtt = await isAttendeesValid(attendees);
  if (isValidAtt) {
    console.log(" All the Attendees are valid ");
    // console.log(allEmailFromTeam , allEmailFromTeam.length);
    // console.log(allAttendeesEmailFromAtt);

    let attendeesArr = allEmailFromTeam.concat(allAttendeesEmailFromAtt);
    //attendeesArr = attendeesArr.map((email) => ({email}));
    // console.log(attendeesArr);

    const meetingData = { name, date, startTime, endTime, description, attendeesArr };
    //console.log(attendeesArr);
    //console.log(meetingData);
    const correctDataOrder = await getDataInFormat(meetingData);
    //console.log(correctDataOrder);
    try {
      const addedMeeting = await addMeeting(correctDataOrder);
      alert(`${addedMeeting.name} added to your Meeting List`);
    } catch (error) {
      alert(error.message);
    }
  } else {
    console.log("attendees or team not present in the data");
  }

  // const data = { name, email, password, confirmPassword };
  // const registrationDetails = { name, email, password };
  // if (isValid(data)) {
  //   register(registrationDetails);
  // } else {
  //   console.log("somthing erroe happend");
  // }
}

document.addEventListener("DOMContentLoaded", function () {
  showUserEmail();
  document.querySelector("#add-meetings").addEventListener("submit", onAddMeetingSubmit);
});
