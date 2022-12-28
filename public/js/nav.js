const menuButton = document.getElementById("menu-button");

menuButton.addEventListener("click", function () {
  // you  get a list of elements
  const navItems = document.querySelectorAll(".nav-items");
  // go through the list and add / remove d-sm-none if present
  for (let i = 0; i < navItems.length; i++) {
    navItems[i].classList.toggle("d-sm-none");
  }
});

const logout = () => {
  console.log("This is called ");
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  localStorage.removeItem("message");
};

document.getElementById('log-out').addEventListener("click", function () {
    logout();
    window.location = "/login.html";
  });
