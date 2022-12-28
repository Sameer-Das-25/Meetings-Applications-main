const getToken = () => localStorage.getItem("token");

if (getToken() === null) {
  alert("Please login first");
  window.location = "/login.html";
}
