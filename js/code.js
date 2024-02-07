const urlBase = 'http://techdeckers.xyz/LAMPAPI';
const extension = 'php';
let contactList = [];
let contactLength = 0;
let globalIndex =0;


// NOT SURE WHAT THESE DO OR IF WE NEED THEM//
function toggleButton() {
    var button = document.getElementById("contactInfoButton");
    button.classList.toggle("clicked");
}

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


//------Backend Magic------//

// Get the info of the user logging in.
let userData = JSON.parse(localStorage.getItem('userData')) || {
    userId: 0,
    firstName: "",
    lastName: "",
    loginId:0
};

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


//------Index Page------//

// Logs a user in
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

// Makes a new user in the database. (Sign up)
function addUser() {
    let registerLogin = document.getElementById("newUsername").value;
    let registerPassword = document.getElementById("psw").value;
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

// Navigates to our github.
function goToGitHub() {
    window.location.href = 'https://github.com/DennisKlingener/Small-Project.git';
}

// Opens the login div.
function openLoginBox() {
    document.getElementById("loginPopUp").style.display = "block";
    closeSignUpBox();
}

// Closes the login div.
function closeLoginBox() {
    document.getElementById("loginPopUp").style.display = "none";
}

// Open sthe sign up div.
function openSignUpBox() {
    document.getElementById("signUpPopUp").style.display = "block";
    closeLoginBox();
}

// Checks if all signup conditions are met. if they have been calls addUser(). If not errors are displayed.
function checkSignUpConditions() {

    // Values to check if all conditions have been met before signing up the new user.
    let firstNameCheck = false;
    let lastNameCheck = false;
    let userNameCheck = false;
    let passwordCheck = false;

    // First get the fist last and user name elements for the signup.
    const newFirstName = document.getElementById('newFirstName');
    const newLastName = document.getElementById('newLastName');
    const newUserName = document.getElementById('newUsername');
    const newPassword = document.getElementById('psw');
    const newPasswordRepeat = document.getElementById('repsw');

    // Check if there is a first name value.
    if (newFirstName.value.trim() === '') {

        // Display first name error message.
        firstNameConditionMessage.style.display = 'block';

    } else {
        firstNameCheck = true;
    }

    // Check if there is a last name value.
    if (newLastName.value.trim() === '') {

        // Display last name error message.
        lastNameConditionMessage.style.display = 'block';

    } else {
        lastNameCheck = true;
    }

    // Check if there is a first name value.
    if (newUserName.value.trim() === '') {

        // Display username error message.
        userNameConditionMessage.style.display = 'block';

    } else {
        userNameCheck = true;
    }

    // Check the password condition.
    passwordCheck = checkPassword(newPassword, newPasswordRepeat);
    
    // Now if all condtions are met we can call add new user.
    if (firstNameCheck === true && lastNameCheck === true && userNameCheck === true && passwordCheck === true) {
        addUser();
    }
}

// Toggles error messages depending on if its condition has been met.
function toggleSignUpMessages() {

    // First get the fist last and user name elements for the signup.
    const newFirstName = document.getElementById('newFirstName');
    const newLastName = document.getElementById('newLastName');
    const newUserName = document.getElementById('newUsername');
    const newPassword = document.getElementById('psw');
    const newPasswordRepeat = document.getElementById('repsw');

    // Check if there is a first name value.
    if (newFirstName.value.trim() !== '') {

        // remove first name error message.
        firstNameConditionMessage.style.display = 'none';
    }

    // Check if there is a last name value.
    if (newLastName.value.trim() !== '') {

        // remove last name error message.
        lastNameConditionMessage.style.display = 'none';
    }

    // Check if there is a first name value.
    if (newUserName.value.trim() !== '') {

        // remove username error message.
        userNameConditionMessage.style.display = 'none';
    }

    // Check the password condition if there is a input value. Avoids funny behaviour with the error messages.
    if (newPassword.value.trim() !== '') {
        checkPassword(newPassword, newPasswordRepeat);
    }
}

// Makes sure the entered password match.
function checkPassword(newPassword, newPasswordRepeat) {

    // Check if there is a password entry.
    if (newPassword.value.trim() !== '') {

        // Remove password error message.
        passwordConditionMessage.style.display = 'none';

        // Check to see if the repeated password matches.
        if (newPasswordRepeat.value.trim() !== newPassword.value.trim()) {

            // Display password must match error message.
            passwordMatchMessage.style.display = 'block';

            // Condition not met.
            return false;

        } else {

            // Remove the message if they match.
            passwordMatchMessage.style.display = 'none';

            // Condition met.
            return true;
        }
        
    } else {

        // display that password is needed.
        passwordConditionMessage.style.display = 'block';

        // Condition not met.
        return false;
    }
}

// Closes the sign up div.
function closeSignUpBox() {

    // First get the elements we need to clear.
    let newFirstName = document.getElementById('newFirstName');
    let newLastName = document.getElementById('newLastName');
    let newUserName = document.getElementById('newUsername');
    let newPassword = document.getElementById('psw');
    let newPasswordRepeat = document.getElementById('repsw');
    
    // Clear all the input boxes.
    newFirstName.value = '';
    newLastName.value = '';
    newUserName.value = '';
    newPassword.value = '';
    newPasswordRepeat.value = '';

    // Close all the error messages.
    firstNameConditionMessage.style.display = 'none';
    lastNameConditionMessage.style.display = 'none';
    userNameConditionMessage.style.display = 'none';
    passwordConditionMessage.style.display = 'none';
    passwordMatchMessage.style.display = 'none';

    // Remove the sign up display.
    document.getElementById("signUpPopUp").style.display = "none";
}













//------Landing Page------//

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

                    // Initializes the default contact card.
                    initUserContactPage();

                    if (jsonObject.results && jsonObject.results.length > 0) {

                        // Create the contactList array.
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

                }
            };
            xhr.send(jsonPayload);
        }
        catch (err) {
        //   document.getElementById("contactSearchResult").innerHTML = err.message;
        }
    }
});

// Initializes the contact table for the currently logged in user.
function intiContactTable () {

    // Get the table element form the document.
    const tableBodyElement = document.getElementById("contactTable");

    // Fill the table with the contact values
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
                globalIndex = index;
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

// Initializes the default contact card to the users name and initials.
function initUserContactPage() {

    // Get the profile icon and name elements.
    const profileIcon = document.getElementById('contactInitials');
    const usersName = document.getElementById('contactFullName');
    const usersNumber = document.getElementById('contactPhoneNumber');
    const usersEmail = document.getElementById('contactEmail');


    // Change the innerhtml to the user specific data.
    profileIcon.innerHTML = userData.firstName[0] + userData.lastName[0];
    usersName.innerHTML = userData.firstName + ' ' + userData.lastName;
    usersNumber.innerHTML = "";
    usersEmail.innerHTML = "";
}

// Refreshes the contact table for the currently logged in user.
function refreshContactTable() {
    // Get the table body element from the document.
    const tableBodyElement = document.getElementById("contactTable");

    // Clear existing table contents
    tableBodyElement.innerHTML = "";

    // Fill the table with the contact values
    for (let index = 0; index < contactList.length; index++) {
        // Create a table row.
        const tableRow = document.createElement("tr");

        // Create a cell to go in the row.
        const rowCell = document.createElement("td");

        // Create a text node to go in the cell.
        const cellText = document.createTextNode(contactList[index].FirstName + ' ' + contactList[index].LastName);

        // Here we need to add the selectable behavior for each row.
        const displayFunction = function(index) {
            // This is what will be done when the row is selected.
            return function() {
                // First get all the elements for the display page.
                let fullNameElement = document.getElementById('contactFullName');
                let phoneNumberElement = document.getElementById('contactPhoneNumber');
                let emailElement = document.getElementById('contactEmail');
                let contactInitialsElement = document.getElementById('contactInitials');
                globalIndex = index;
                // Now we can apply the correct information for this index of the contactlist.
                fullNameElement.innerHTML = contactList[index].FirstName + ' ' + contactList[index].LastName;
                phoneNumberElement.innerHTML = contactList[index].Phone;
                emailElement.innerHTML = contactList[index].Email;
                contactInitialsElement.innerHTML = contactList[index].FirstName[0] + contactList[index].LastName[0];
            };
        };

        // Add the onclick function for this row.
        tableRow.onclick = displayFunction(index);

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

        // Append the text node to the row cell.
        rowCell.appendChild(cellText);

        // Append the row cell to the table row.
        tableRow.appendChild(rowCell);

        // Append the table row to the table body.
        tableBodyElement.appendChild(tableRow);
    }
}


// This functon adds the new contact to the contact list after it is successfully added to the database.
function updateContactList(newFirstName, newLastName, newEmail, newNumber) {

    // Get the table element from the document.
    const tableBodyElement = document.getElementById("contactTable");

    contactList.push({
            FirstName: newFirstName,
            LastName: newLastName,
            Phone: newNumber,
            Email: newEmail});

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

// This functon removes the contact that was deleted from contact list after it is successfully deleted to the database.
function deleteContactList(firstName, lastName) {
    // Get the table body element from the document.
    const tableBodyElement = document.getElementById("contactTable");

    // Get all rows in the table body.
    const rows = tableBodyElement.getElementsByTagName("tr");

    // Loop through each row to find the matching contact.
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName("td");
        // Assuming first cell in each row contains full name.
        const fullName = cells[0].innerText.trim();
        // Splitting full name into first name and last name.
        const [existingFirstName, existingLastName] = fullName.split(' ');

        // Check if the current row matches the contact to be deleted.
        if (existingFirstName === firstName && existingLastName === lastName) {
            // Remove the row from the table.
            tableBodyElement.removeChild(row);

             // Remove the contact from the contactList array.
            contactList.splice(i, 1);

            // Exiting the loop since we found and deleted the contact.
            return;
        }
    }

    // If the loop completes without finding the contact, it means it doesn't exist.
    console.log(`Contact ${firstName} ${lastName} not found.`);
}


// Adds a new contact to the users account.                             Contact add result feature does not do anything!
function addContacts() {
    let newFirstName = document.getElementById("newContactFirstName").value;
    let newLastName = document.getElementById("newContactLastName").value;
    let newEmail = document.getElementById("newContactEmail").value;
    let newNumber = document.getElementById("newContactNumber").value;
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
                refreshContactTable();
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("contactAddResult").innerHTML = err.message;
    }
}

// Searchs for a contact.       Need to make this work with the search bar.
function searchContacts() {
    let srch = document.getElementById("searchBar").value;
    document.getElementById("contactSearchResult").innerHTML = "";

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
                  //    console.log(jsonObject.results[i]);
        }
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
     //   document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}


function deleteContact() {
    let firstName = contactList[globalIndex].FirstName;
    let lastName = contactList[globalIndex].LastName

    let tmp = {
            firstName: firstName,
            lastName: lastName,
            UserID: userData.userId
    };
        console.log(tmp);
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

               // Delete contact to the users table
                 deleteContactList(firstName,lastName);
                 refreshContactTable();
                 initUserContactPage();
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
            console.log("Delete did not work");
    }

}

// Displays the "newContactPopup" div so the new contact info can be entered.
function openNewContactBox() {
    document.getElementById("newContactPopup").style.display = "block";
}

// Closes the new contact box.
function closeNewContactBox() {
    document.getElementById("newContactPopup").style.display = "none";
}

// Clears the new contact information fields when the new contact information box is closed.
function clearNewContactFields() {

    // Get the input fields.
    var firstName = document.getElementById("newContactFirstName");
    var lastName = document.getElementById("newContactLastName");
    var newEmail = document.getElementById("newContactEmail");
    var newNumber = document.getElementById("newContactNumber");

    // Clear them.
    firstName.value = '';
    lastName.value = '';
    newEmail.value = '';
    newNumber.value = '';
}

// Logs a user out and returns to the index page.
function doLogout() {
    userData.userId = 0;
    userData.firstName = "";
    userData.lastName = "";
    userData.loginId = 0;
    localStorage.removeItem('userData');
    window.location.href = "index.html";
}
