import { getAllUserEmail } from "./add-new-team.js";
let myEmail;
const showUserEmail = () => {
  const userEl = document.querySelector("#loged-in-user");

  let userDetails = localStorage.getItem("email");
  //console.log(userDetails);
  myEmail = userDetails;
  userEl.innerHTML = `Hello <span class="primary">${userDetails}</span>!`;
};

const onLoadMemberListDefault = async () => {
  const email = document.getElementById("emails").value; //email

  const all_members = document.querySelector(".add-team-member-section");
  //console.log(all_members);
  let selectedMember = email + "";
  all_members.innerHTML += selectedMember;
  getAllUserEmail();
  //console.log(all_members);
};

const addAttendeesToTeam = async (event) => {
  event.preventDefault();
  const form = event.target;
  const teamId = form.closest(".team-search-result");
  const id = teamId.getAttribute("team-id");
  let email;
  console.log(id);
  const all_email = document.querySelectorAll("#emails");
  all_email.forEach((emails) => {
    if (emails.value !== "") {
      email = emails.value;
    }
  });
  console.log(email);
  let requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") },
    redirect: "follow",
  };

  const response = await fetch(
    `https://mymeetingsapp.herokuapp.com/api/teams/${id}?action=add_member&email=${email}`,
    requestOptions
  );
  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || "Some error occured");
  }
  console.log("user added succesfullyu");
  fetchAndShowTeams();
};

const excuseYourselfFromTeam = async (event) => {
  event.preventDefault();
  console.log("hello");
  const excuse = event.target;
  const teamId = excuse.closest(".team-search-result");
  const id = teamId.getAttribute("team-id");
  const email = myEmail;
  console.log(id);
  console.log(email);

  var requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: localStorage.getItem("token") },
    redirect: "follow",
  };

  const response = await fetch(
    `https://mymeetingsapp.herokuapp.com/api/teams/${id}?action=remove_member`,
    requestOptions
  );
  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || "Some error occured");
  }
  const teamsDetails = await response.json()
  alert(teamsDetails.name+ " has been removed From your team list");
  fetchAndShowTeams();
};

const addExcuseYourselfFromTeamHandler = () => {
  
  document.querySelectorAll(".excuse-yourself-from-team").forEach((excuse) => {
    excuse.addEventListener("click", excuseYourselfFromTeam);
  });
};

const addAddAttendeetoTeamHandler = () => {
  document.querySelectorAll(".add-member-to-team").forEach((form) => {
    form.addEventListener("submit", addAttendeesToTeam);
  });
};

const fetchAndShowTeams = async () => {
  const response = await fetch(`https://mymeetingsapp.herokuapp.com/api/teams`, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || "Some error occured");
  }
  //console.log(response);
  const teamsDetails = await response.json();
  //console.log(teamsDetails);

  const teamsDetailsEl = document.querySelector(".teams-info");

  // let attendeesList = attendeesArray.join("");
  // console.log(attendeesList);

  let teamsDetailsContainerStr = "";
  for (let i = 0; i < teamsDetails.length; i++) {
    const id = teamsDetails[i]._id;
    const name = teamsDetails[i].name;
    let attendees = teamsDetails[i].members;
    const shortname = teamsDetails[i].shortName;
    const description = teamsDetails[i].description;
    let attendeesArr = [];

    for (let j = 0; j < attendees.length; j++) {
      attendeesArr.push(attendees[j].email);
    }
    let attendeesList = attendeesArr.join(", ");
    //console.log(name);
    //console.log(id);
    //  console.log(shortname);
    //  console.log(description);
    //  console.log(attendeesList);
    const teamStr = `
  <div class="content team-search-result" team-id="${id}">
    <div class="content-title font-bold">${name}</div>
    <div class="font-bold">@${shortname}</div>
    <div class="font-bold text-gray">${description}</div>
    <div class="mb-2">
    <button class="btn btn-danger excuse-yourself-from-team" >Excuse yourself</button></div>
    <hr />
    <div class="attendees mb-1">
      <span class="font-bold">Attendees:</span>
      ${attendeesList}
    </div>
    <div class="select-mem-div">
      <form class="add-member-to-team">
        <input list="members" name="members" class="select-members" placeholder="Select members" id="emails"/>
        <datalist id="members">
        </datalist>

        <input type="submit" value="Add" class="btn-primary btn select-members" />
      </form>
    </div>
  </div>
    `;
    teamsDetailsContainerStr += teamStr;
  }
  teamsDetailsEl.innerHTML = teamsDetailsContainerStr;
  await getAllUserEmail();
  addAddAttendeetoTeamHandler();
  addExcuseYourselfFromTeamHandler();
  onLoadMemberListDefault();
};

document.addEventListener("DOMContentLoaded", function () {
  showUserEmail();
  fetchAndShowTeams().then(() => {
    //console.log(document.querySelector(".calender-details"));
  });
});

export { fetchAndShowTeams };
