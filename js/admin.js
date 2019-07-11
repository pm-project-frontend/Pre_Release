//#region Defining object arrays
let loggedUser = "";
let zResultIssue = [];
let zResultProject = [];
let zResultUser = [];
//#endregion
//#region Defining main buttons
let btnListUsers = document.getElementById("listUsers");
let btnRegUser = document.getElementById("createUser");
let btnListProjects = document.getElementById("listProjects");
let btnCreateProject = document.getElementById("createProject");
let btnSubmitProject = document.getElementById("submitProject");
let btnCreateUser = document.getElementById("regUser");
//#endregion
//#region Show/Hide status of divs
document.getElementById("zCreateUser").style.display = "none";
document.getElementById("zCreateProject").style.display = "none";
btnRegUser.addEventListener("click", function () {
    document.getElementById("zCreateUser").style.display = "block";
    document.getElementById("zCreateProject").style.display = "none";
    document.getElementById("zListDiv").innerHTML = "";
    document.getElementById("editDiv").innerHTML = "";
})
btnCreateProject.addEventListener("click", function () {
    document.getElementById("zCreateProject").style.display = "block";
    document.getElementById("zCreateUser").style.display = "none";
    document.getElementById("zListDiv").innerHTML = "";
    document.getElementById("editDiv").innerHTML = "";
})
//#endregion
//#region Getting data
checkUp();
async function importJsons() {
    try {
        let projectResult = await fetch("https://pm-project-frontend.github.io/jsons/projects.json");
        let issueResult = await fetch("https://pm-project-frontend.github.io/jsons/issues.json");
        let userResult = await fetch("https://pm-project-frontend.github.io/jsons/users.json");
        let zForLocalProjects = await projectResult.json();
        let zForLocalIssues = await issueResult.json();
        let zForLocalUsers = await userResult.json();
        localStorage.setItem("users", JSON.stringify(zForLocalUsers));
        localStorage.setItem("projects", JSON.stringify(zForLocalProjects));
        localStorage.setItem("issues", JSON.stringify(zForLocalIssues));
        getResults();
        giveBasicInfo();
    } catch (error) {
        throw new Error("There has been an error receiving the files. Please try again later.")
    }
}
function checkUp() {
    if (localStorage.getItem("users") != null) {
        getResults();
        giveBasicInfo();
    } else {
        importJsons();
    }
}
async function getResults() {
    zResultIssue = await JSON.parse(localStorage.getItem("issues"));
    zResultProject = await JSON.parse(localStorage.getItem("projects"));
    zResultUser = await JSON.parse(localStorage.getItem("users"));
    giveBasicInfo();
}
//#endregion
//#region Print Default Info
function giveBasicInfo() {
    document.getElementById("numOfRegUsers").innerHTML = `Number of registered users: ${zResultUser.length}`
    document.getElementById("numOfRegProjects").innerHTML = `Number of registered projects: ${zResultProject.length}`
    document.getElementById("numOfRegIssues").innerHTML = `Number of registered issues: ${zResultIssue.length}`
}
//#endregion
//#region List all Users Button event listener
btnListUsers.addEventListener("click", function () {
    let mainElem = document.getElementById("zListDiv");
    document.getElementById("editDiv").innerHTML = "";
    mainElem.innerHTML = "";
    document.getElementById("zCreateUser").style.display = "none";
    document.getElementById("zCreateProject").style.display = "none";
    for (const elem of zResultUser) {
        mainElem.innerHTML += `<div class="emp-profile"><p id=${elem.id}>User ID: ${elem.id} - Full name: ${elem.firstName} ${elem.lastName} 
        <br>User Role: ${elem.role} Status: ${elem.status} <br>  Email: ${elem.email} - Username: ${elem.userName}</p><br>
        <input type="button" name="deleteUser" id="${elem.id}" value="Delete">
        <input type="button" name="editUser" id="${elem.id}" value="Edit">
        <input type="button" name="viewUser" id="${elem.id}" value="View"></div>`
    }
})
document.getElementById("zListDiv").addEventListener("click", (e) => {
    if (e.target.name == "deleteUser") {
        if (confirm("Are you sue you want to delete this user?")) {
            delUser(Number(e.target.id));
            localStorage.setItem("users", JSON.stringify(zResultUser));
        }
    } else if (e.target.name == "editUser") {
        editUser(Number(e.target.id))
        document.getElementById("zListDiv").innerHTML = "";
    } else if (e.target.name == "viewUser") {
        localStorage.setItem("editUser", JSON.stringify(e.target.id));
        window.location.href = "profile2.html";
    }
}
)
//#endregion
//#region Edit Users
function editUser(reqId) {
    pos = zResultUser.map(function (e) { return e.id; }).indexOf(reqId);
    user = zResultUser[pos];
    document.getElementById("editDiv").innerHTML =
        `<div class="container emp-profile">
                <fieldset id="myFieldsetUser">
                    <legend>Edit User:</legend>
                    First Name <br>
                    <input type="text" id="firstNameEdit" value="${user.firstName}" required><br>
                    Last Name: <br>
                    <input type="text" id="lastNameEdit" value="${user.lastName}" required><br>
                    Username:<br>
                    <input type="text" id="userNameEdit" value="${user.userName}" required><br>
                    Password:<br>
                    <input type="text" id="passwordEdit" value="${user.password}"><br>
                    Email:<br>
                    <input type="email" id="emailEdit" value="${user.email}"> <br>
                    <br>
                    <input type="radio" id="statusActive" name="statusEdit" value="active">
                    <label for="statusActive">Active</label>
                    <br>
                    <input type="radio" id="statusDisable" name="statusEdit" value="suspended">
                    <label for="statusDisable">Suspended</label>
                    <br>
                    <button id="btnEditUser" name="update">Save</button>
                </fieldset>
            </div>`
    if (user.status == "active") {
        document.getElementById("statusActive").checked = true;
    } else {
        document.getElementById("statusDisable").checked = true;
    };
    document.getElementById("btnEditUser").addEventListener("click", () => {
        const stat = document.querySelector('input[name="statusEdit"]:checked').value;
        let updatedUser = ({
            "id": user.id,
            "firstName": document.getElementById("firstNameEdit").value,
            "lastName": document.getElementById("lastNameEdit").value,
            "userName": document.getElementById("userNameEdit").value,
            "password": document.getElementById("passwordEdit").value,
            "email": document.getElementById("emailEdit").value,
            "image": user.image,
            "language": user.language,
            "status": stat,
            "assigned_issues": user.assigned_issues,
            "watched_issues": user.watched_issues,
            "role": user.role
        })
        zResultUser.splice(pos, 1, updatedUser);
        localStorage.setItem("users", JSON.stringify(zResultUser));
    })
};
//#endregion
//#region List all Projects Button event listener
btnListProjects.addEventListener("click", function () {
    let mainElem = document.getElementById("zListDiv");
    document.getElementById("editDiv").innerHTML = "";
    mainElem.innerHTML = "";
    document.getElementById("zCreateUser").style.display = "none";
    document.getElementById("zCreateProject").style.display = "none";
    for (const elem of zResultProject) {
        mainElem.innerHTML += `<div class="emp-profile"><p id=${elem.id}>Project name: ${elem.projectName}, Version: ${elem.version} <br> 
        Organization: ${elem.organization} <br> Status of project: ${elem.status}<br> 
        Create Date: ${elem.createDate} <br>Due Date: ${elem.dueDate} <br> Number of issues: ${elem.issues.length}</p><br>
        <input type="button" name="delete" id="${elem.id}" value="Delete">
        <input type="button" name="edit" id="${elem.id}" value="Edit">`
    }
})
document.getElementById("zListDiv").addEventListener("click", (e) => {
    if (e.target.name === "delete") {
        if (confirm("Are you sue you want to delete this project?")) {
            delProject(Number(e.target.id));
            localStorage.setItem("projects", JSON.stringify(zResultProject));
            localStorage.setItem("issues", JSON.stringify(zResultIssue));
            localStorage.setItem("users", JSON.stringify(zResultUser));

        }
    } else if (e.target.name === "edit") {
        editProject(Number(e.target.id))
        document.getElementById("zListDiv").innerHTML = "";
    }
}
)
//#endregion
//#region Edit Projects
function editProject(reqIdpro) {
    project = zResultProject.find(x => x.id == reqIdpro);
    posProject = zResultProject.indexOf(project);
    document.getElementById("editDiv").innerHTML =
        `<div class="container emp-profile">
                <fieldset id="myFieldsetUser">
                    <legend>Edit Project:</legend>
                    Project Name <br>
                    <input type="text" id="projectNameEdit" value="${project.projectName}" required><br>
                    Organizaton <br>
                    <input type="text" id="organizationEdit" value="${project.organization}" required><br>
                    Due Date:<br>
                    <input type="date" id="dueDateEdit" value="${project.dueDate}" required><br>
                    Version:<br>
                    <input type="text" id="versionEdit" value="${project.version}"><br>
                    Description:<br>
                    <input type="text" id="descriptionEdit" value="${project.description}">
                    <br>
                    <input type="radio" id="ststusOpen" name="statusEditProject" value="Open">
                    <label for="statusOpen">Open</label>
                    <br>
                    <input type="radio" id="statusClosed" name="statusEditProject" value="Closed">
                    <label for="statusClosed">Closed</label>
                    <br>
                    <button id="btnEditProject" name="update">Save</button>
                </fieldset>
            </div>`
    if (project.status == "Open") {
        document.getElementById("ststusOpen").checked = true;
    } else {
        document.getElementById("statusClosed").checked = true;
    }
    document.getElementById("btnEditProject").addEventListener("click", () => {
        const stat = document.querySelector('input[name="statusEditProject"]:checked').value;
        let updatedProject = ({
            "id": project.id,
            "projectName": document.getElementById("projectNameEdit").value,
            "organization": document.getElementById("organizationEdit").value,
            "description": document.getElementById("descriptionEdit").value,
            "dueDate": document.getElementById("dueDateEdit").value,
            "issues": project.issues,
            "version": document.getElementById("versionEdit").value,
            "status": stat,
        })
        zResultProject.splice(posProject, 1, updatedProject);
        localStorage.setItem("projects", JSON.stringify(zResultProject));
    })
};
//#endregion
//#region Creating Project
btnSubmitProject.addEventListener("click", (e) => {
    e.preventDefault();
    let projectName = document.getElementById("projectName").value;
    let organization = document.getElementById("organization").value;
    let dueDate = document.getElementById("dueDate").value;
    let version = document.getElementById("version").value;
    let description = document.getElementById("description").value;
    let id = zResultProject.length + 1;
    if (projectValidation(projectName, zResultProject)) {
        zResultProject.push({
            "id": id.toString(),
            "status": "open",
            "projectName": projectName,
            "organization": organization,
            "dueDate": dueDate,
            "version": version,
            "description": description,
            "issues": [],
            "createDate": getDate()
        })
        localStorage.setItem("projects", JSON.stringify(zResultProject));
    } else {
        console.log("Project with that name already exists!");
    }
    document.getElementById("zCreateProject").style.display = "none";
    document.getElementById("projectName").value = "";
    document.getElementById("organization").value = "";
    document.getElementById("dueDate").value = "";
    document.getElementById("version").value = "";
    document.getElementById("description").value = "";
})
function projectValidation(projectName, projectList) {
    let projectState = true;
    for (const project of projectList) {
        if (projectName === project.projectName) {
            projectState = false;
            break;
        } else {
            projectState = true;
        }
    }
    return projectState;
}
//#endregion
//#region Creating User
btnCreateUser.addEventListener("click", function () {
    e.preventDefault();
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let userName = document.getElementById("userName").value;
    let password = document.getElementById("password").value;
    const role = document.querySelector('input[name="roles"]:checked').value;
    let email = document.getElementById("email").value;
    if (userValidation(userName, email, zResultUser)) {
        zResultUser.push({
            "id": zResultUser[zResultUser.length - 1].id + 1,
            "firstName": firstName,
            "lastName": lastName,
            "userName": userName,
            "password": password,
            "role": role,
            "email": email,
            "image": "",
            "language": "en",
            "status": "active",
            "assigned_issues": [],
            "watched_Issues": []
        })
        localStorage.setItem("users", JSON.stringify(zResultUser));
    } else {
        console.log("User with that email address already exists!");
    }
    document.getElementById("zCreateUser").style.display = "none";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("userName").value = "";
    document.getElementById("password").value = "";
    document.getElementById("role").value = "";
    document.getElementById("email").value = "";
})
function userValidation(userName, email, usersList) {
    let userState = true;
    for (const user of usersList) {
        if (email === user.email || userName === user.userName) {
            userState = false;
            break;
        } else {
            userState = true;
        }
    }
    return userState;
}
//#endregion
//#region Deleting Users and Projects
function delUser(reqId) {
    let user = zResultUser.find(x => x.id == reqId);
    let pos = zResultUser.indexOf(user);
    zResultUser.splice(pos, 1);
}
function delProject(reqId) {
    let project = zResultProject.find(x => x.id == reqId);
    let issuesArr = project.issues;
    for (const issueId of issuesArr) {
        let issue = zResultIssue.find(x => x.id == issueId);
        let issuePos = zResultIssue.indexOf(issue);
        zResultIssue.splice(issuePos, 1);
    };
    for (var user of zResultUser) {
        for (var issueId of issuesArr) {
            for (iss of user.assigned_issues) {
                if (iss == issueId) {
                    let simpPos = user.assigned_issues.indexOf(iss)
                    user.assigned_issues.splice(simpPos, 1);
                }
            }
            for (iss of user.watched_issues) {
                if (iss == issueId) {
                    let simpPos = user.watched_issues.indexOf(iss);
                    user.watched_issues.splice(simpPos, 1);
                }
            }
        }
    }
    let pos = zResultProject.indexOf(project);
    zResultProject.splice(pos, 1);
}
//#endregion
//#region LogOut func
document.getElementById("logOutBtn").addEventListener("click", () => {
    // localStorage.clear("loggedUser");
    adminLogged = false;
    localStorage.setItem("adminLogged", adminLogged);
    window.open("login.html", "_self");
})
//#endregion
//#region Main Page Link
document.getElementById("MainPageBtn").addEventListener("click", () => {
    window.open("main.html", "_self");
})
//#endregion
//#region Creation Date
function getDate() {
    today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //As January is 0.
    var yyyy = today.getFullYear();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    return `${yyyy}-${mm}-${dd}`;
};

//#endregion