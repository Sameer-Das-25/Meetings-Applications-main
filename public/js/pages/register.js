// register f

const register = async (registrationDetails) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(registrationDetails);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(`https://mymeetingsapp.herokuapp.com/api/auth/register`, requestOptions);
  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText || "Some error occured");
  } else {
    alert("regertered success");
    location.href = "login.html";
  }
};

const isValid = (data) => {
  const name = data.name;
  const email = data.email;
  const password = data.password;
  const confirmPassword = data.confirmPassword;
  if (name == "") {
    alert("Name field requird");
    return false;
  }
  if (email == "") {
    alert("Email field requird");
    return false;
  }
  if (password == "") {
    alert("Password field requird");
    return false;
  }
  if (confirmPassword == "") {
    alert("ConfirmPassword field requird");
    return false;
  }
  if (password.localeCompare(confirmPassword) != 0) {
    alert("Please enter same password");
    return false;
  }
  return true;
};

async function onRegisterFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("username").value; //username
  const email = document.getElementById("email").value; //email
  const password = document.getElementById("password").value; //password
  const confirmPassword = document.getElementById("confirm-Password").value; //confirm password

  const data = { name, email, password, confirmPassword };
  console.log(data);
  const registrationDetails = { name, email, password };
  if (isValid(data)) {
    register(registrationDetails);
  } else {
    console.log("somthing erroe happend");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#register-form").addEventListener("submit", onRegisterFormSubmit);
});
