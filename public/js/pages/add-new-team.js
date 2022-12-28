import { fetchAndShowTeams } from "./load-all-teams.js";

const getAllUserEmail = async () => {
  //console.log("Yes i Started loading the email in all the select member section");
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
  const membersCardDataListEl = document.getElementById("members");
  let membersCardDataList = "";
  for (let i = 0; i < allUserdata.length; i++) {
    // console.log(allUserdata[i].email);
    const eachEmail = `
           <option value="${allUserdata[i].email}"></option>
        `;
    membersCardDataList += eachEmail;
  }
  //console.log(membersCardDataList);
  membersCardDataListEl.innerHTML = membersCardDataList;
  //console.log("yes I finished the work loaded all email in all places");
};

// this function will take the email from select member section in add team from and append its value in list of all members string which is initically empty
const onAddMemberClick = async (event) => {
  event.preventDefault();
  const email = document.getElementById("new-emails").value; //email
  console.log(email);
  const all_members = document.querySelector(".add-team-member-section");
  console.log(all_members);
  let selectedMember = email + ", ";
  all_members.innerHTML += selectedMember;
 // getAllUserEmail();
  //console.log(all_members);
};


// This function will take the data object and add the team in the database
const addTeam = async (data) =>{
  const raw = JSON.stringify(data);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json",
     Authorization: localStorage.getItem("token") 
    },
    body: raw,
    redirect: "follow",
  };
  const response = await fetch(`https://mymeetingsapp.herokuapp.com/api/teams`, requestOptions);

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || "Some error occured");
  }
  console.log(response);
  return response.json();
}

const onAddTeamSubmit = async (event) => {
  event.preventDefault();

  const name = document.getElementById("team-name").value;
  const shortName = document.getElementById("team-short-name").value;
  const description = document.getElementById("description").value;
  const memberslist = document.getElementById("member-list").innerHTML;
  const membersArr = memberslist.split(",");
  membersArr.pop();
  const members = membersArr.map((elements) => {
    return elements.trim();
  });
//  console.log(name, shortName, description, members);
  const data = {name, shortName, description, members}
 // console.log(data);
  try {
    const addedTeam = await addTeam(data);
    alert(`${addedTeam.name} added to your Team List`);
    window.location.reload();
    fetchAndShowTeams();
  } catch (error) {
    alert(error.message);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  getAllUserEmail();
  document.querySelector("#add-member-btn").addEventListener("click", onAddMemberClick);
  document.querySelector("#add-team-from").addEventListener("submit", onAddTeamSubmit);
});

export{
  getAllUserEmail
}