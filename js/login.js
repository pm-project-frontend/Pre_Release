var btnLogIn = document.getElementById("btnLogIn");
let adminLogged = false;
//Successfully logged user
let LoggedUserId;

//Local storages
let localStorageUsers;
let localStorageProjects;
let localStorageIssues;

//The user trying to login
let userAttempting;
let userAttemptingId;
let attempts = 0;

checkUp();

//Checks if local storage is loaded with basic data
function checkUp() {
  if (localStorage.getItem("users") == null) {
    importJsons();
  } else {
    loadLocalStorage();
  }
}

//Grabbing data from the jsons
async function importJsons() {
  try {
    let users = await fetch("https://pm-project-frontend.github.io/jsons/users.json");
    let projects = await fetch("https://pm-project-frontend.github.io/jsons/projects.json");
    let issues = await fetch("https://pm-project-frontend.github.io/jsons/issues.json");
    let usersData = await users.json();
    let projectsData = await projects.json();
    let issuesData = await issues.json();
    localStorage.setItem("users", JSON.stringify(usersData));
    localStorage.setItem("projects", JSON.stringify(projectsData));
    localStorage.setItem("issues", JSON.stringify(issuesData));
    loadLocalStorage();
  } catch (error) {
    throw new Error("Something went wrong.")
  }
}

//Loading data into local storage
async function loadLocalStorage() {
  try {
    let lsUsers = await localStorage.getItem("users");
    let lsProjects = await localStorage.getItem("projects");
    let lsIssues = await localStorage.getItem("issues");
    localStorageUsers = JSON.parse(lsUsers);
    localStorageProjects = JSON.parse(lsProjects);
    localStorageIssues = JSON.parse(lsIssues);
  } catch (error) {
    throw new Error("Something went wrong.")
  }
}

//LogIn button
btnLogIn.addEventListener("click", function (e) {
  e.preventDefault();
  var username = document.getElementById("fusername").value;
  var password = document.getElementById("fpassword").value;
  consecutiveAttempts(username);
  checkLogin(username, password);
})

//Login check for consecutive attempts
function consecutiveAttempts(username) {
  if (username !== userAttempting) {
    userAttempting = username;
    attempts = 0;
  }
}

//Logging went ok
function loginPassed(page, id) {
  attempts = 0;
  userAttempting = null;
  localStorage.setItem("loggedUser", id);
  loginIsOk = false;
  window.location.href = page;
}

//Suspension of an account
function suspendAccount(id) {
  localStorageUsers[id - 1].status = "suspended";
  localStorage.setItem("users", JSON.stringify(localStorageUsers));
  userAttemptingId = null;
  userAttempting = null;
  attempts = 0;
  alert("Three unsuccessful attempts, your account has been suspended. Contact your admin.");
}

//Main check procedure
function checkLogin(username, password) {
  //Checking for empty fields
  if (username === "" || password === "") {
    return alert("Don't leave empty fields.")
  }
  //If only the username is correct, goes for further check up, like account status, and number of attempts
  for (const user of localStorageUsers) {
    if (user.userName === username && user.password !== password) {
      //Registering which user is trying to login
      userAttemptingId = user.id;
      //Checking if his/her account is suspended
      if (user.status === "suspended") {
        return alert("Your account has been suspended. Contact your administrator.");
      }
      //Checking if the user has less than three consecutive unsuccessful attempts
      if (user.userName === userAttempting && attempts !== 2) {
        attempts++;
        return alert("Something went wrong, check your username/password.");
      }
      //Suspension after three consecutive unsuccessful attempts
      if (user.userName === userAttempting && attempts === 2) {
        return suspendAccount(userAttemptingId);
      }
    }
    //If the username nad password are correct
    if (user.userName === username && user.password === password) {
      let loginIsOk = true;
      userAttemptingId = user.id;
      //Checking if the account is suspended
      if (user.status === "suspended") {
        return alert("Your account has been suspended. Contact your administrator.");
      }
      //Checking if the user is admin
      if (loginIsOk && user.role === "admin") {
        adminLogged = true;
        localStorage.setItem("adminLogged", adminLogged);
        return loginPassed("admin.html", userAttemptingId);
      }
      //Checking if it's non-admin account
      if (loginIsOk && user.role === "user") {
        return loginPassed("main.html", userAttemptingId);
      }
    }
  }
  //Shows up if we have attempt from non-registered user
  alert("There's no such user.")
}