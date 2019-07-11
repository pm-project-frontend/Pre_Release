let user;
const backBtn = document.getElementById("return");
const aboutBtn = document.getElementById("home-tab");
const editBtn = document.getElementById("profile-tab");
const submitBtn = document.getElementById("submit-btn");

getUsersInfo();

async function getUsersInfo(){
    let id = await JSON.parse(localStorage.getItem("editUser"));
    let users = await JSON.parse(localStorage.getItem("users"));
    user = await users.find(user => user.id === Number(id));
    displayPicture(id);
    displayInfo(user);
    fillEditFields(user);
}

function displayPicture(id){
    document.getElementById("userImg").setAttribute("src", `pictures/${id}.jpg`);
    document.getElementById("userImg2").setAttribute("src", `pictures/${id}.jpg`);
}

function displayInfo(data){
    document.getElementById("full-name").innerText = data.firstName + " " + data.lastName;
    document.getElementById("info-username").innerText = data.userName;
    document.getElementById("info-name").innerText = data.firstName;
    document.getElementById("info-surname").innerText = data.lastName;
    document.getElementById("info-email").innerText = data.email;
}

function fillEditFields(data){
    document.getElementById("firstName").setAttribute("placeholder", data.firstName);
    document.getElementById("lastName").setAttribute("placeholder", data.lastName);
    document.getElementById("email").setAttribute("placeholder", data.email);
}

function checkInputs(input){
    if (document.getElementById(input).value != "") {
        user[input] = document.getElementById(input).value;
    }
}

function passwordChange(oldPass, newPass, newPassConfirmed){
    if (oldPass === user.password) {
        if(newPass === newPassConfirmed){
            user.password = newPass;
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

async function updateUserBase(user){
    let users = await JSON.parse(localStorage.getItem("users"));
    users[Number(user["id"]) - 1] = user;
    localStorage.setItem("users", JSON.stringify(users));
}

function checkEditing(){
    const oldPass = document.getElementById("old-password").value;
    const newPass = document.getElementById("new-password").value;
    const newPassConfirmed = document.getElementById("new-password-confirmed").value;
    let passChangeOk;
    let inputs = ["firstName", "lastName", "email"];
    let confirmed = confirm("Are you sure you wanna change your data?")

    if (confirmed) {
        for (let index = 0; index < inputs.length; index++) {
            checkInputs(inputs[index]);
        }

        if(oldPass != "" && newPass != "" && newPassConfirmed != "") {
            passChangeOk = passwordChange(oldPass, newPass, newPassConfirmed);

            if (passChangeOk) {

                user["password"] = newPass;

                updateUserBase(user)

                return alert("Your change has been successful");
            } else {

                return alert("Something went wrong, try again.")
            }
        }

        updateUserBase(user)

        return alert("Your change has been successful");
    } else {
        return alert("Your data will remain unchanged.");
    }
}

submitBtn.addEventListener("click", () => {
    checkEditing();
})

backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("pic-file").classList.add("d-none")
    window.location.href = "admin.html";
})

aboutBtn.addEventListener("click", () => {
    document.getElementById("profile-pic").classList.remove("d-none");
    document.getElementById("edit-pic").classList.add("d-none");
    document.getElementById("pic-file").classList.add("d-none");
})

editBtn.addEventListener("click", () => {
    document.getElementById("profile-pic").classList.add("d-none");
    document.getElementById("edit-pic").classList.remove("d-none");
    document.getElementById("pic-file").classList.remove("d-none");
})