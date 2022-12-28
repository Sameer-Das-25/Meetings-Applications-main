// this method will show all the user in the system at select member option
let period;
let search;
let myEmail;
const getAllUserEmail = async () => {
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
  const meetingCardDataListEl = document.querySelector(".meeting-card-datalist");
  let meetingCardDataList = "";
  for (let i = 0; i < allUserdata.length; i++) {
    //  console.log(allUserdata[i].email);
    const eachEmail = `
         <option value="${allUserdata[i].email}"></option>
      `;
    meetingCardDataList += eachEmail;
  }

  meetingCardDataListEl.innerHTML = meetingCardDataList;
};

// to load the email in the navbar
const showUserEmail = () => {
  const userEl = document.querySelector("#loged-in-user");

  let userDetails = localStorage.getItem("email");
  myEmail = userDetails;
  userEl.innerHTML = `Hello <span class="primary">${userDetails}</span>!`;
};

// this method takes the response recieved after fetching the datat with given period and search

const disPlayAllFetchedMeetings = async (data) => {
  const meetingDetailEl = document.querySelector("#filter-meeting-details");
  meetingDetailEl.innerHTML = "";
  let meetingDetailContainerStr = "";

  const month = [
    "January",
    "Febuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  for (let i = 0; i < data.length; i++) {
    const attendeesArr = [];
    for (let j = 0; j < data[i].attendees.length; j++) {
      attendeesArr[j] = data[i].attendees[j].email;
    }
    let attendeesList = attendeesArr.join(", ");

    let date = data[i].date.substring();
    date = date
      .substring(8, 10)
      .concat(" ".concat(month[parseInt(date.substring(5, 7)) - 1].concat(" ".concat(date.substring(0, 4)))));
    const name = data[i].name;
    let startTimehour = data[i].startTime.hours;
    if (startTimehour < 10) startTimehour = "0".concat(startTimehour);
    let startTimeMinues = data[i].startTime.minutes;
    if (startTimeMinues < 10) startTimeMinues = "0".concat(startTimeMinues);

    let endTimehour = data[i].endTime.hours;
    if (endTimehour < 10) endTimehour = "0".concat(endTimehour);
    let endTimeMinues = data[i].endTime.minutes;
    if (endTimeMinues < 10) endTimeMinues = "0".concat(endTimeMinues);
    const id = data[i]._id;
    const eachMeetingDiv = `
    <div class="search-result my-2" data-id = "${id}">
            <div class="mb-1">
              <span class="meeting-date">${date}</span>
              <span class="meeting-time">${startTimehour}:${startTimeMinues} - ${endTimehour}:${endTimeMinues}</span>
            </div>
            <div class="meeting-name">${name}</div>
            <div class="mb-2"><button class="btn btn-danger excuse-yourself" id="excuse-yourself-${id}" >Excuse yourself</button></div>
            <hr />
            <div class="attendees mb-1">
              <span class="font-bold">Attendees:</span>
              ${attendeesList}
            </div>
  
            <div class="select-mem-div">
            <form method="post" id="add-member-to-meeting-${id}" class="add-member-to-meeting">
            <input type="hidden" name="id" value="${id}" id="id"/>
              <input type="email" list="members" name="emails" id="emails" class="select-members" placeholder="Select members" />
              <datalist id="members" class="meeting-card-datalist"></datalist>
              <input type="submit" value="Add" class="btn-primary btn select-members" />
              </form>
            </div>
          </div>
       `;
    meetingDetailContainerStr += eachMeetingDiv;
  }
  meetingDetailEl.innerHTML += meetingDetailContainerStr;
  await getAllUserEmail();
  addAddAttendeeHandler();
  addExcuseYourselfHandler();
};

const addAttendeesToMeeting = async (event) => {
  event.preventDefault();
  const form = event.target;
  const userId = form.closest(".search-result");
  const id = userId.getAttribute("data-id");
  let email;
  console.log(id);
  const all_email = document.querySelectorAll("#emails");
  all_email.forEach((emails) => {
    if (emails.value !== "") {
      email = emails.value;
    }
  });
  console.log(email);
  console.log("this is the data");

  let requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") },
    redirect: "follow",
  };

  const response = await fetch(
    `https://mymeetingsapp.herokuapp.com/api/meetings/${id}?action=add_attendee&email=${email}`,
    requestOptions
  );
  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || "Some error occured");
  }
  // alert("User added successfully");
  try {
    const response = await getMeetingDetails(period, search);
    // console.log(response.length);
    console.log("Succesfully execuated");
    await disPlayAllFetchedMeetings(response);
    console.log("I finished task");
  } catch (error) {
    console.log(error.message);
  }
};

const excuseYourselfFromMeeting = async (event) => {
  event.preventDefault();
  const excuse = event.target;
  const userId = excuse.closest(".search-result");
  const id = userId.getAttribute("data-id");
  const email = myEmail;

  console.log(id);
  console.log(email);

  var requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") },
    redirect: "follow",
  };

  const response = await fetch(
    `https://mymeetingsapp.herokuapp.com/api/meetings/${id}?action=remove_attendee`,
    requestOptions
  );
  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || "Some error occured");
  }
  //alert("Removed Successfully");
  try {
    const response = await getMeetingDetails(period, search);
    // console.log(response.length);
    console.log("Succesfully execuated");
    await disPlayAllFetchedMeetings(response);
    console.log("I finished task");
  } catch (error) {
    console.log(error.message);
  }
};

// this funciton fetch the meeting details based on period and searched passed
const getMeetingDetails = async (period, search) => {
  const response = await fetch(`https://mymeetingsapp.herokuapp.com/api/meetings?period=${period}&search=${search}`, {
    headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") },
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || "Some error occured");
  }

  //console.log(response);
  return response.json();
};

const addExcuseYourselfHandler = () => {
  document.querySelectorAll(".excuse-yourself").forEach((excuse) => {
    console.log("hi");
    excuse.addEventListener("click", excuseYourselfFromMeeting);
  });
};

const addAddAttendeeHandler = () => {
  document.querySelectorAll(".add-member-to-meeting").forEach((form) => {
    form.addEventListener("submit", addAttendeesToMeeting);
  });
};

// this function will give the give the details of the meetings
async function onFilterMeetings(event) {
  event.preventDefault();

  period = document.getElementById("period").value; //username
  search = document.getElementById("search").value; //email

  // console.log("this is the period ", period);
  // console.log("this is the search ", search);
  const data = { period, search };

  try {
    const response = await getMeetingDetails(period, search);
    // console.log(response.length);
    console.log("Succesfully execuated");
    await disPlayAllFetchedMeetings(response);
    console.log("I finished task");
  } catch (error) {
    if (error.message === `Cannot set properties of null (setting 'innerHTML')`)
      alert(" No meeting found the Selected period");
    console.log(error.message);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  showUserEmail();
  document.querySelector("#filter-meetings").addEventListener("submit", onFilterMeetings);
});
