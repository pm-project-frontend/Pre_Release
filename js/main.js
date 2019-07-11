//#region variables
let gDataProjects;
let gDataIssues;
let gDataUsers;
let loggedUserId = JSON.parse(localStorage.getItem("loggedUser"));
let watchedIssue;
//#endregion
//#region inputs
let gInputs = {
    gContainerOne: document.getElementById("g-container1"),
    gContainerTwo: document.querySelector(".g-container2"),
    gFirstDiv: document.querySelector(".g-first"),
    gSecondDiv: document.querySelector(".g-second"),
}
//#endregion
gInputs.gContainerTwo.style.display = "block";
//#region populate project div 
gGetData();

function gPopulateStaticProjectPart(element){
    return element.innerHTML += `
    <div class="g-projects g-header">Projects</div>
    `
}
function gPopulateProjects(element,data){
    element.innerHTML += `
            <div class="g-projects-box" id="${data.id}">${data.projectName}</div> 
    `
    };
function gGenerateTable(data){
    gPopulateStaticProjectPart(gInputs.gFirstDiv);
        for(let weth of data){
            gPopulateProjects(gInputs.gFirstDiv,weth);
        }
    }
//#endregion
//#region populate wathed issue div
function gPopulateStaticIssueParts(element){
return element.innerHTML += 
`
<div class="g-issues">
        <div class="g-header">Watched Issues</div>
        <div class="g-watched-header g-watched-header-title">
                <div>Key</div>
                <div>Summary</div>
                <div>Status</div>
        </div>
</div>
`
}
function gPopulateIssuesOneRow(element,data){

    element.innerHTML += `
        <div class="g-watched-header g-watched-header-data" id="${data.project}" title="${data.id}">
                <div id="${data.project}" title="${data.id}">${data.id}</div>
                <div id="${data.project}" title="${data.id}">${data.summary}</div>
                <div id="${data.project}" title="${data.id}">${data.status}</div>
        </div>
    `
}
function gGenerateTable1(data,users){
    //find logged user
    let findUser = users.find(user => user.id === loggedUserId);
    gPopulateStaticIssueParts(gInputs.gSecondDiv);
    //find array of watched issues
    if(findUser.watched_issues.length !== 0){
        for(var issue of findUser.watched_issues){
            for(let weth of data){
                console.log(weth.id)
                if(weth.id === issue){
                    gPopulateIssuesOneRow(gInputs.gSecondDiv,weth);
                }
            }
           
    }
}

}
//#endregion
//#region populate assigne div 
function gPopulateStaticAssignePart(element,findIssue,findUser){
    //find user
    let user = findUser.find(user => user.id === loggedUserId);
    element.innerHTML += 
    `
    <div class="g-assign">
    <div class="g-header">Assigned to Me</div>
</div>
    `
    //find if user have assigned issues
    if(user.assigned_issues.length !== 0){
        let filterArr = findIssue.filter(project => user.assigned_issues.includes(project.id));
        console.log(user.assigned_issues)
        for(var project of filterArr){
            element.innerHTML += 
                `
                <div class="g-assign-body" id="${project.project}" title="${project.id}">${project.summary}</div>
                `
        }
    }else{
        element.innerHTML +=
        `
                <div class="g-assign-body">You currently have no Issues assigned to you.Enjoy
                        your day.</div>
        `
    }
}
//#endregion
//#region populate header section
function gPopulateHeaderSection(findIssue,findProject){
    gInputs.gContainerTwo.innerHTML += `
    <header class="g-project-header">                  
    <h3 id="g-selected-header2">${findProject.projectName}</h3>
    <h1 id="g-selected-header1">${findIssue.summary}</h1>
    </header>
    `
}
//#endregion
//#region populate description table
function gPopulateDescriptionSection(findIssue){
    gInputs.gContainerTwo.innerHTML +=
    `
        <table class="g-table">
            <tr>
                <td>Type: </td>
                <td><i class="fas fa-bug"></i> ${findIssue.issue_type}</td>
            </tr>
            <tr>
                <td>Priority: </td>
                <td><i class="fas fa-ban"></i> ${findIssue.priority}</td>
            </tr>
            <tr>
                <td>Affects Version/s: </td>
                <td>${findIssue.affectedVersion}</td>
            </tr>
            <tr>
                <td>Component/s: </td>
                <td>${findIssue.component}</td>
            </tr>
            <tr>
                <td>Status: </td>
                <td><input type="button" value="${findIssue.status}" class="g-dropbtn g-dropbtn1"></td>
            </tr>
            <tr>
                <td>Fix Version: </td>
                <td>${findIssue.fixVersion}</td>
            </tr>
        </table>
    `
}
//#endregion
//#region populate people table
function gPopulatePeopleSection(findReporter,findUser,findIssue,user,issues){
    console.log(findIssue.id);
    //user who is loged 
    let assigneUser = user.find(userId => userId.id === loggedUserId);
    console.log(assigneUser.watched_issues)
    //find out if the logged user watch this issue
    let watch = assigneUser.watched_issues.includes(findIssue.id);
    let check = assigneUser.assigned_issues.includes(findIssue.id);
    let assigne;
    let watched;
    let watchedId;
    //user who is assigne in the moment when logged user go to the iisue page
    let assignedUser = findUser.firstName + " " +  findUser.lastName;
    if(watch === true && check === true){
        assigne = "";
        watched = "Stop watching this issue";
        watchedId = "stop-watch";
        populateAssigneAndWatchedTable(assignedUser,findReporter,assigne,watched,watchedId);
    }
    else if(watch === false && check === true){
        assigne = "";
        watched = "Start watch this issue";
        watchedId = "start-watch";
        populateAssigneAndWatchedTable(assignedUser,findReporter,assigne,watched,watchedId);
    }else if(watch === false && check === false){
        assigne = "Assigne to me";
        watched = "Start watch this issue";
        watchedId = "start-watch";
        populateAssigneAndWatchedTable(assignedUser,findReporter,assigne,watched,watchedId);
    }else{
        assigne = "Assigne to me";
        watched = "Stop watching this issue";
        watchedId = "stop-watch";
        populateAssigneAndWatchedTable(assignedUser,findReporter,assigne,watched,watchedId);
    }
   
    gInputs.gContainerTwo.addEventListener("click",function(e){
        console.log(e.target.id);
        if(e.target.id === "assigne"){
            assigneToMe(user,findIssue,findUser,issues);
            document.getElementById("assigne").disabled = true;
            document.getElementById("assigne").style.visibility="hidden";
            assignedUser = assigneUser.firstName + " " + assigneUser.lastName;
            document.getElementById("assigne").id = "";
            document.getElementById("full-name").innerHTML = `
            <i class="fas fa-check-double"></i> ${assignedUser}
            `;
        }else if(e.target.id === "stop-watch"){
                document.getElementById("stop-watch").id = "start-watch";
                document.getElementById("start-watch").textContent = "Start watch this issue";
                stopWatchingIssue(user,findIssue,issues);
                console.log(e.target.id);
        }else if(e.target.id === "start-watch"){
            document.getElementById("start-watch").id = "stop-watch";
            document.getElementById("stop-watch").textContent = "Stop watching this issue";
            startWatchIssue(user,findIssue,issues);
            console.log(e.target.id);
        }

        loadingMenus();

    });
};
//#endregion

//#region populate table with assigne and watch
function populateAssigneAndWatchedTable(assignedUser,findReporter,assigne,watched,watchedId){
    gInputs.gContainerTwo.innerHTML +=
    `
    <table class="g-table">
        <tr>
            <td></td>
            <td><a class="g-link" id="assigne">${assigne}</a></td>
        </tr>
        <tr>
            <td>Assignee: </td>
            <td id="full-name"><i class="fas fa-check-double"></i> ${assignedUser}</td>
        </tr>
        <tr>
            <td>Reporter:</td>
            <td id="reporter"><i class="fas fa-user"></i> ${findReporter.firstName} ${findReporter.lastName}</td>
        </tr>
        <tr>
            <td>Watchers:</td>
            <td> <a class="g-link" id=${watchedId}> ${watched}</a></td>
        </tr>
        </table>
    ` 
}
//#endregion
//#region assigne method
function assigneToMe(user,issue,findUser,issues){
    let assigneUser = user.find(userId => userId.id === loggedUserId);
    //find index of issue in  the user assignedIssue array who was assigned 
    let index = findUser.assigned_issues.indexOf(issue.id);
    //find index of user who was assigned
    let indexOfExAssignedUser = user.findIndex(x => x.id === findUser.id);
    let indexOfLoggedUser = user.findIndex(x => x.id === assigneUser.id);
    let indexOfIssue = issues.findIndex(x => x.id === issue.id);
    console.log(indexOfIssue)
    //find loged user
    if(!(assigneUser.assigned_issues.includes(issue.id))){
        assigneUser.assigned_issues.push(issue.id);
        findUser.assigned_issues.splice(index,1);
        issue.assignee = assigneUser.id;
        updateUsers(findUser,user,indexOfExAssignedUser);
        updateUsers(assigneUser,user,indexOfLoggedUser);
        updateIssue(issue,issues,indexOfIssue);
    }
}
//#endregion
//#region update issue method
function updateIssue(issue,issues,indexOfIssue){
    let updateIssue = {
        "id": issue.id,
        "project": issue.project,
        "issue_type": issue.issue_type,
        "reporter": issue.reporter,
        "organization": issue.organization,
        "summary": issue.summary,
        "priority": issue.priority,
        "dueDate": issue.dueDate,
        "component": issue.component,
        "affectedVersion": issue.affectedVersion,
        "fixVersion": issue.fixVersion,
        "assignee": issue.assignee,
        "description": issue.description,
        "createDate": issue.createDate,
        "comments": issue.comments,
        "fixVersion": issue.fixVersion,
        "status": issue.status,
        "watchers": issue.watchers
    };
    issues.splice(indexOfIssue,1,updateIssue);
    localStorage.setItem("issues", JSON.stringify(issues));
}
//#endregion
//#region updateUsers method
function updateUsers(findUser,user,indexOfExAssignedUser){
    let updateExAssignedUser = {
        "id": findUser.id,
        "firstName": findUser.firstName,
        "lastName": findUser.lastName,
        "userName": findUser.userName,
        "password": findUser.password,
        "role": findUser.role,
        "email": findUser.email,
        "image": findUser.image,
        "language": findUser.language,
        "status": findUser.status,
        "assigned_issues": findUser.assigned_issues,
        "watched_issues": findUser.watched_issues
    };
    user.splice(indexOfExAssignedUser,1,updateExAssignedUser);
    localStorage.setItem("users", JSON.stringify(user));
}
//#endregion
//#region stop watch method
function stopWatchingIssue(user,issue,issues){
    //find logged user
    let assigneUser = user.find(userId => userId.id === loggedUserId);
    //find index of logged user
    let indexOfLoggedUser = user.findIndex(x => x.id ===assigneUser.id);
    let indexOfIssue = issues.findIndex(x => x.id === issue.id);
    //find index of watched issue
    let index = assigneUser.watched_issues.findIndex(x => x === issue.id);
    //find index of user in array of watched issue
    let indexOfWatcher = issue.watchers.findIndex(x => x === assigneUser.id);
    if(assigneUser.watched_issues.includes(issue.id)){
        assigneUser.watched_issues.splice(index,1);
        issue.watchers.splice(indexOfWatcher,1);
        updateUsers(assigneUser,user,indexOfLoggedUser);
        updateIssue(issue,issues,indexOfIssue);
    }
}
//#endregion
//#region start watch method
function startWatchIssue(user,issue,issues){
    //find logged user
    let loggedUser = user.find(x => x.id === loggedUserId);
    //find index of logged user 
    let index = user.findIndex(x => x.id === loggedUser.id);
    //find index of issue
    let indexOfIssue = issues.findIndex(x => x.id === issue.id);
    if(!(loggedUser.watched_issues.includes(issue.id))){
        //push issue in the watched issues array
        loggedUser.watched_issues.push(issue.id);
        issue.watchers.push(loggedUserId);
        updateUsers(loggedUser,user,index);
        updateIssue(issue,issues,indexOfIssue);
    }
}
//#endregion
//#region show description
function gPopulateDescription(findIssue){
    gInputs.gContainerTwo.innerHTML +=
    `
    <div class="g-project-description">
            <h3 class="g-header-description">Description</h3>
            <div class="g-body-description">${findIssue.description}</div>
    </div>
    `
}
//#endregion
//#region populate dates
function gPopulateDates(findIssue,findProject){
    gInputs.gContainerTwo.innerHTML +=
    `
    <div class="g-project-details">
            <table class="g-table">
            <tr>
                <td>Created Date: </td>
                <td><em>${findIssue.createDate}</em></td>
            </tr>
            <tr>
                <td>Due Date:</td>
                <td><em>${findProject.dueDate}</em></td>
            </tr>
        </table>
    <div class="g-dates">
    `
}
//#endregion
//#region comment area
function gPopulateCommentArea(findIssue,findUser,issues){
    let findCommentator = findIssue.comments;
    let index = issues.findIndex(x => x.id === findIssue.id);
    let userName = findUser.find(user => user.id === loggedUserId);
    let gCommentDiv = document.createElement("div");
    gInputs.gContainerTwo.appendChild(gCommentDiv);
    gCommentDiv.setAttribute("class","g-comment-part");
    let gHeaderThree = document.createElement("h3");
    gCommentDiv.appendChild(gHeaderThree);
    gHeaderThree.setAttribute("class","g-header-description");
    gHeaderThree.innerHTML = "Comments";
    let gTextArea = document.createElement("div");
    gCommentDiv.appendChild(gTextArea);
    gTextArea.setAttribute("class","g-text-area");
    let gCommentArea = document.createElement("div");
    gInputs.gContainerTwo.appendChild(gCommentArea);
    let gParagraph = document.createElement("p");
    gCommentArea.appendChild(gParagraph);
    gParagraph.setAttribute("class","g-paragraph");
    gParagraph.innerHTML += `<img src="${userName.image}"/> ${userName.firstName} ${userName.lastName}`
    let gTextBtn = document.createElement("input");
    gParagraph.appendChild(gTextBtn);
    gTextBtn.setAttribute("class","g-text-btn");
    let gSubmitBtn = document.createElement("button");
    gParagraph.appendChild(gSubmitBtn);
    gSubmitBtn.setAttribute("class","g-dropbtn g-dropbtn1");
    gSubmitBtn.innerHTML = "Comment";
    if(findCommentator!==null){
        for(var comment of findCommentator){
            //find id of commentator in users json to get full name
            let findUserId = findUser.filter(id => id.id === comment.userID);
            for(var id of findUserId){
                gTextArea.innerHTML += `
                <p class="g-paragraph"><img src="${id.image}"/> <span class="g-comments-text"><span class="g-full-name"> ${id.firstName} ${id.lastName} :</span> ${comment.c}</span></p>
                `
            }
        }
    } 
    gSubmitBtn.addEventListener("click",function(){
        let gComment = gTextBtn.value;
        let user = gDataUsers.find(user => user.id === loggedUserId);
        if(gComment !== "" && gComment !== null){
            gTextArea.innerHTML += `
            <p class="g-paragraph"><img src="${user.image}"/> <span class="g-comments-text"><span class="g-full-name">${user.firstName} ${user.lastName}:</span> ${gComment}</span></p>
            `
            findCommentator.push({userID: user.id,c: gComment});
            updateIssue(findIssue,issues,index);
        }
        gTextBtn.value = "";
    });   
};
//#endregion
//#region firstDiv event
gInputs.gFirstDiv.addEventListener("click",function(e){
    if(e.target.id !== undefined && e.target.id !== null && e.target.id !== "" && e.target.id.length !== 0 && e.target.classList.contains("g-projects-box")){
        gInputs.gContainerOne.style.display = "none";
        let findProject = gDataProjects.find(project => project.id === e.target.id);
        localStorage.setItem("viewProject", JSON.stringify(findProject.id));
        document.getElementById("projectsPage").classList.remove("d-none");
        background.style.filter = "blur(7px)";
        findTheProject(gDataProjects, e.target.id);
    }
});
//#endregion
//#region secondDiv event
gInputs.gSecondDiv.addEventListener("click",function(e){
    if(e.target.id !== undefined && e.target.id !== null && e.target.id !== "" && e.target.id.length !== 0){
        gInputs.gContainerOne.style.display = "none";
        gInputs.gContainerTwo.style.display = "block";
        document.getElementsByClassName("g-container2")[0].classList.remove("d-none");
        populateIssuePage(e.target);
    }
});
//#endregion
//#region populate issue page
function populateIssuePage(e){
    let findIssue = gDataIssues.filter(issue => issue.project === e.id)
        .find(issue => issue.id === e.title);
        console.log(findIssue);
        let findProject = gDataProjects.find(project => project.id === e.id);
        let findUser = gDataUsers.find(user => user.id === findIssue.assignee);
        let findReporter = gDataUsers.find(project => project.id === findIssue.reporter)
        gPopulateHeaderSection(findIssue,findProject);
        gPopulateDescriptionSection(findIssue);
        gPopulatePeopleSection(findReporter,findUser,findIssue,gDataUsers,gDataIssues);
        gPopulateDescription(findIssue);
        gPopulateDates(findIssue,findProject);
        gPopulateCommentArea(findIssue,gDataUsers,gDataIssues);
}
//#endregion
//#region fetch
async function gGetData() {
    try {
        gDataUsers = JSON.parse(localStorage.getItem("users"));
        gDataProjects = JSON.parse(localStorage.getItem("projects"));
        gDataIssues = JSON.parse(localStorage.getItem("issues"));
        gGenerateTable(gDataProjects);
        gGenerateTable1(gDataIssues,gDataUsers);
        gPopulateStaticAssignePart(gInputs.gSecondDiv,gDataIssues,gDataUsers);
    } catch (error) {
        throw new Error("Error!!!!")
    }
}
//#endregion