const urlBase = 'http://techdeckers.xyz/LAMPAPI';
const extension = 'php';

let userData = JSON.parse(localStorage.getItem('userData')) || {
    userId: 0,
    firstName: "",
    lastName: "",
    loginId: 0
};

let contactList = [];
let contactLength = 0;


function doLogin() {
    userData.userId = 0;
    userData.firstName = "";
    userData.lastName = "";

    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPassword").value;

    let tmp = { login: login, password: password };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userData.userId = jsonObject.id;

                if (userData.userId < 1) {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }

                userData.firstName = jsonObject.firstName;
                userData.lastName = jsonObject.lastName;
                userData.loginId = userData.userId;

                saveUserData();
                window.location.href = "contacts.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function saveUserData() {
    localStorage.setItem('userData', JSON.stringify(userData));
}

function readUserData() {
    let storedUserData = JSON.parse(localStorage.getItem('userData'));
    if (storedUserData) {
        userData = storedUserData;
    }
    else {
        window.location.href = "index.html";
    }
}

function doLogout() {
    userData.userId = 0;
    userData.firstName = "";
    userData.lastName = "";
    userData.loginId = 0;
    localStorage.removeItem('userData');
    window.location.href = "index.html";
}

// Other functions

// Dont need vv

function addColor() {
    let newColor = document.getElementById("colorText").value;
    document.getElementById("colorAddResult").innerHTML = "";

    let tmp = { color: newColor, userId: userData.userId, loginId: userData.loginId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddColor.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("colorAddResult").innerHTML = "Color has been added";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("colorAddResult").innerHTML = err.message;
    }
}

function searchColor() {
    let srch = document.getElementById("searchText").value;
    document.getElementById("colorSearchResult").innerHTML = "";

    let colorList = "";

    let tmp = { search: srch, userId: userData.userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchColors.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);

                for (let i = 0; i < jsonObject.results.length; i++) {
                    colorList += jsonObject.results[i];
                    if (i < jsonObject.results.length - 1) {
                        colorList += "<br />\r\n";
                    }
                }

                document.getElementsByTagName("p")[0].innerHTML = colorList;
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("colorSearchResult").innerHTML = err.message;
    }
}

// Dont need ^^

function addUser() {
    let registerLogin = document.getElementById("newUsername").value;
    let registerPassword = document.getElementById("newPassword").value;
    let newFirstName = document.getElementById("newFirstName").value;
    let newLastName = document.getElementById("newLastName").value;
    document.getElementById("userAddResult").innerHTML = "";

    let tmp = {
        firstName: newFirstName,
        lastName: newLastName,
        Login: registerLogin,
        Password: registerPassword
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddUser.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("userAddResult").innerHTML = "User has been added";
                closeSignUpBox();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("userAddResult").innerHTML = err.message;
    }
}

// Contact add result feature doesnt do anything!
function addContacts() {
    let newFirstName = document.getElementById("newFirstName").value;
    let newLastName = document.getElementById("newLastName").value;
    let newEmail = document.getElementById("newEmail").value;
    let newNumber = document.getElementById("newNumber").value;
    document.getElementById("contactAddResult").innerHTML = "";

    let tmp = {
        firstName: newFirstName,
        lastName: newLastName,
        Phone: newNumber,
        Email: newEmail,
        UserID: userData.userId
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                document.getElementById("contactAddResult").innerHTML = "Contact has been added";

                // add new contact to the users table.
                updateContactList(newFirstName, newLastName, newEmail, newNumber);
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

function searchContacts() {
    let srch = document.getElementById("searchBar").value;
   // document.getElementById("contactSearchResult").innerHTML = "";

    let tmp = {
          search: "",
        UserID: userData.userId
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
               // document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
                let jsonObject = JSON.parse(xhr.responseText);

                for (let i = 0; i < jsonObject.results.length; i++) {
                   // contactList += jsonObject.results[i];
			        contactLength++;
                    contactList.push({
                        FirstName: jsonObject.results[i].FirstName,
                        LastName: jsonObject.results[i].LastName,
                        Phone: jsonObject.results[i].Phone,
                        Email: jsonObject.results[i].Email});
                }
                    for (let i = 0; i < contactList.length; i++)
                    {
                        console.log(contactList[i].FirstName, contactList[i].LastName,contactList[i].Phone,contactList[i].Email);
                    }

               // document.getElementsByTagName("p")[0].innerHTML = contactList;
		    console.log(contactLength);
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
     //   document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}

function goToGitHub() {
    window.location.href = 'https://github.com/DennisKlingener/Small-Project.git';
}

function checkPassword() {
    var input = document.getElementById('psw');
    if (input.value != document.getElementById('repsw').value) {
        input.setCustomValidity('Password Must be Matching.');
    } else {
        input.setCustomValidity('');
    }
}

function openLoginBox() {
    document.getElementById("loginPopUp").style.display = "block";
    closeSignUpBox();
}

function closeLoginBox() {
    document.getElementById("loginPopUp").style.display = "none";
}

function openSignUpBox() {
    document.getElementById("signUpPopUp").style.display = "block";
    closeLoginBox();
}

function closeSignUpBox() {
    document.getElementById("signUpPopUp").style.display = "none";
}

function openNewContactBox() {
    document.getElementById("newContactPopup").style.display = "block";
}

function closeNewContactBox() {
    document.getElementById("newContactPopup").style.display = "none";
}

// Used with closeNewContactBox().
function clearNewContactFields() {

        // Get the input fields.
        var firstName = document.getElementById("newFirstName");
        var lastName = document.getElementById("newLastName");
        var newEmail = document.getElementById("newEmail");
        var newNumber = document.getElementById("newNumber");

        // Clear them.
        newFirstName.value = '';
        newLastName.value = '';
        newEmail.value = '';
        newNumber.value = '';
}
function toggleButton() {
    var button = document.getElementById("contactInfoButton");
    button.classList.toggle("clicked");
}

// This waits until the contact.html page is loaded and creates the table full of the users contacts.
document.addEventListener("DOMContentLoaded", function() {

    if (document.title === "Contacts Page") {

        let srch = document.getElementById("searchBar").value;
        // document.getElementById("contactSearchResult").innerHTML = "";

        let tmp = {
            search: "",
            UserID: userData.userId
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/SearchContacts.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                // document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
                    let jsonObject = JSON.parse(xhr.responseText);

                    for (let i = 0; i < jsonObject.results.length; i++) {
                        contactLength++;
                        contactList.push({
                            FirstName: jsonObject.results[i].FirstName,
                            LastName: jsonObject.results[i].LastName,
                            Phone: jsonObject.results[i].Phone,
                            Email: jsonObject.results[i].Email});
                    }
                        
                    // INIT CONTACT TABLE!
                    intiContactTable();
                }
            };
            xhr.send(jsonPayload);
        }
        catch (err) {
        //   document.getElementById("contactSearchResult").innerHTML = err.message;
        }
    }
});

// This functon adds the new contact to the contact list after it is successfully added to the database.
function updateContactList(newFirstName, newLastName, newEmail, newNumber) {

    // Get the table element from the document.
    const tableBodyElement = document.getElementById("contactTable");


    console.log(newFirstName);
    console.log(newLastName);
    console.log(newEmail);
    console.log(newNumber);


    // Create a new table row.
    const tableRow = document.createElement("tr");

    // Create a cell to go in the row.
    const rowCell = document.createElement("td");

    // Create a text cell to go in the cell.
    const cellText = document.createTextNode(newFirstName + ' ' + newLastName);

    // Here we need to add the selectable behaviour for each row.
    var displayFunction = function(tableRow) {

        // This is what will be done when the row is selected.
        return function() {

            // First get all the elements for the display page.
            let fullNameElement = document.getElementById('contactFullName');
            let phoneNumberElement = document.getElementById('contactPhoneNumber');
            let emailElement = document.getElementById('contactEmail');
            let contactInitialsElement = document.getElementById('contactInitials');

            // Now we can apply the correct information for this index of the contactlist. 
            fullNameElement.innerHTML = newFirstName + ' ' + newLastName;
            phoneNumberElement.innerHTML = newNumber;
            emailElement.innerHTML = newEmail;
            contactInitialsElement.innerHTML = newFirstName[0] + newLastName[0]; // This might not work.....
        };
    };

    // Add the onclick fucntion for this row.
    tableRow.onclick = displayFunction(tableRow);

    // Add some mouse over styling here.
    tableRow.onmouseover = function() {
        tableRow.style.backgroundColor = "#039dfc";
        tableRow.style.color = "#0800ff";
    };

    // Revert back to default when mouse off.
    tableRow.onmouseout = function() {
        tableRow.style.backgroundColor = "";
        tableRow.style.color = "";
    };

    // Appened the text cell to the row cell.
    rowCell.appendChild(cellText);

    // Append the row cell to the table row.
    tableRow.appendChild(rowCell);

    // Append the table row to the table body.
    tableBodyElement.appendChild(tableRow);
}

// Initializes the contact table for the currently logged in user.
function intiContactTable () {

    // Get the table element form the document.
    const tableBodyElement = document.getElementById("contactTable");

    // Fill the table with the contact values (this is test values for now)
    for (let index = 0; index < contactLength; index++) {

        // Create a table row.
        const tableRow = document.createElement("tr");

        // Create a cell to go in the row.
        const rowCell = document.createElement("td");

        // Create a text cell to go in the cell.
        const cellText = document.createTextNode(contactList[index].FirstName + ' ' + contactList[index].LastName);

        // Here we need to add the selectable behaviour for each row.
        var displayFunction = function(tableRow, index) {

            // This is what will be done when the row is selected?
            return function() {

                // First get all the elements for the display page.
                let fullNameElement = document.getElementById('contactFullName');
                let phoneNumberElement = document.getElementById('contactPhoneNumber');
                let emailElement = document.getElementById('contactEmail');
                let contactInitialsElement = document.getElementById('contactInitials');

                // Now we can apply the correct information for this index of the contactlist. 
                fullNameElement.innerHTML = contactList[index].FirstName + ' ' + contactList[index].LastName;
                phoneNumberElement.innerHTML = contactList[index].Phone;
                emailElement.innerHTML = contactList[index].Email;
                contactInitialsElement.innerHTML = contactList[index].FirstName[0] + contactList[index].LastName[0];
            };
        };

        // Add the onclick fucntion for this row.
        tableRow.onclick = displayFunction(tableRow, index);

        // Add some mouse over styling here.
        tableRow.onmouseover = function() {
            tableRow.style.backgroundColor = "#039dfc";
            tableRow.style.color = "#0800ff";
        };

        // Revert back to default when mouse off.
        tableRow.onmouseout = function() {
            tableRow.style.backgroundColor = "";
            tableRow.style.color = "";
        };

        // Cursor styles.
        tableRow.style.cursor = 'pointer';

        // Appened the text cell to the row cell.
        rowCell.appendChild(cellText);

        // Append the row cell to the table row.
        tableRow.appendChild(rowCell);

        // Append the table row to the table body.
        tableBodyElement.appendChild(tableRow);
    }
}
