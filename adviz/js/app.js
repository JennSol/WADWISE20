var mymap = L.map('map').setView([52.456009, 13.527571], 14);
var contact_Map = new Map();
var activeUser;
var oldContactInfo;

var marker = new Array();

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoia2Fyc3RlbmFic2NoaWVkIiwiYSI6ImNrZ210OGRzaDF1eTAydHRldzdzbTZ0MG8ifQ.Y8abAkOxDNR_Am3Ij1GNzw'

}).addTo(mymap);

function Contact(title, gender, firstName, lastName, street, house, postcode, city, country, email, other, private) {
    this.title = title;
    this.gender = gender;
    this.firstName = firstName;
    this.lastName = lastName;
    this.street = street;
    this.house = house;
    this.postcode = postcode;
    this.city = city;
    this.country = country;
    this.email = email;
    this.other = other;
    this.private = private;
}


let neumann = new Contact(null, 'female', 'Susi', 'Neumann', 'Landsberger Allee', 320, 10365, 'Berlin', 'Deutschland', 'Neumann@gmail.de', null, false);
let schuster = new Contact(null, 'male', 'Robert', 'Schuster', 'Oberfeldstraße', 91, 12683, 'Berlin', 'Deutschland', 'Schuster@hotmail.de', null, true);
let mayer = new Contact(null, 'female', 'Anne', 'Mayer', 'Bernauer Str.', 50, 10435, 'Berlin', 'Deutschland', 'Mayer@outlook.de', null, false);
let mueller = new Contact(null, 'male', 'Hans', 'Mueller', 'Berliner Allee', 261, 13088, 'Berlin', 'Deutschland', 'Mueller@mail.de', null, true);
function generateUsers() {
    let admina = new User('Admina', 'abc', [mueller, neumann], true);
    let normalo = new User('Normalo', 'abc', [schuster, mayer], false);
    return [admina, normalo];
}

let users = generateUsers();
function User(username, password, contacts, admin) {
    this.username = username;
    this.password = password;
    this.contacts = contacts;
    this.admin = admin;
};

function authenticate(username, password) {
    //hardcoded login data, normally we would call our backend here
    let authenticated = false;
    users.forEach(element => {
        if (username == element.username && password == element.password) {
            activeUser = element;
            authenticated = true;
        }
    });
    if(authenticated){
        loginSuccessful();
    }else {
        alert('Benutzername oder Passwort inkorrekt');
    }
}

function loginSuccessful() {
    greeting();
    disableLoginView();
    enableAdminView();
}

function disableLoginView() {
    loginview = document.getElementById('login_view');
    loginview.style.display = 'none';

}

function enableAdminView() {
    adminview = document.getElementById('admin_view');
    adminview.style.display = 'initial';
    mymap.invalidateSize();
    showMyContacts();
}

function login() {
    let password = document.getElementById('password').value;
    let username = document.getElementById('user_name').value;
    authenticate(username, password);
}

function disableUpdateView() {
    document.getElementById('delete_update_screen').style.display = 'none';
}

function enableAddnew_dialog() {
    document.getElementById('addnew_dialog').style.display = 'initial';
}

function disableAddnew_dialog() {
    document.getElementById('addnew_dialog').style.display = 'none';
}

function disableAdminView() {
    adminview = document.getElementById('admin_view');
    adminview.style.display = 'none';
    clearContactList();
}

function enableLoginView() {
    loginview = document.getElementById('login_view');
    loginview.style.display = 'initial';
    document.getElementById('user_name').value = '';
    document.getElementById('password').value = '';
}

function logout() {
    disableAdminView();
    enableLoginView();
}

function addContactToContactList(counter, element) {
    contact_Map.set(counter, element);
    let li = document.createElement("li");
    let contactInfo = document.createTextNode(element.firstName + " " + element.lastName);
    let call = "https://api.tomtom.com/search/2/geocode/" + element.street + "%20" + element.house + "%20" + element.city + ".json?countrySet=DE&key=uPEVVjJEplE0v14jGXIeRVhKOKjfVFtJ"
    const request = new Request(call);
    const url = request.url;
    const method = request.method;
    removeAllMarkersFromMap();
    fetch(request)
        .then(response => response.json())
        .then(json => {
            let contactAddedToMap = false;
            json.results.forEach(result => {
                if (result.type == "Point Address" && !contactAddedToMap) {
                    let newMarker = L.marker([parseFloat(result.position.lat), parseFloat(result.position.lon)]);
                    marker.push(newMarker);
                    newMarker.addTo(mymap).bindPopup('<b>' + element.firstName + " " + element.lastName + "</b><br>" + element.street + " " + element.house + ", " + element.postcode);
                    contactAddedToMap = true;
                };
            });
        });
    const credentials = request.credentials;
    li.appendChild(contactInfo);
    li.id = counter;
    li.addEventListener("click", function (event) {
        id = event.target.id;
        openUpdateScreen(id);
    });
    contactList.appendChild(li);

}

function removeAllMarkersFromMap() {
    marker.forEach(element => {
        mymap.removeLayer(element);
    });
}

function showMyContacts() {
    clearContactList();
    let counter = 0;
    contact_Map.clear();
    contactList = document.getElementById('contact_list');
    removeAllMarkersFromMap();
    activeUser.contacts.forEach(element => {
        addContactToContactList(counter, element);
        counter++;
    });
}

function showAllContacts() {
    clearContactList();
    let counter = 0;
    contact_Map.clear();
    contactList = document.getElementById('contact_list');
    removeAllMarkersFromMap();
    users.forEach(user => {
        user.contacts.forEach(element => {
            if (isMyContact(element) == true || !element.private || activeUser.admin && element.private) {
                addContactToContactList(counter, element);
                counter++;
            }
        });
    });
}


function isMyContact(contact) {
    for (let index = 0; index < activeUser.contacts.length; index++) {
        if (activeUser.contacts[index] == contact) {
            return true;
        }
    }
}

function clearContactList() {
    let contactList = document.getElementById('contact_list');
    while (contactList.firstChild) {
        contactList.removeChild(contactList.firstChild);
    }
}

function openUpdateScreen(id) {
    let contactInfo = contact_Map.get(parseInt(id));
    if (isMyContact(contactInfo) == true || activeUser.admin == true) {
        let updateScreen = document.getElementById('delete_update_screen');
        disableAdminView();
        updateScreen.style.display = 'initial';
        document.getElementById('title_d').value = contactInfo.title;
        document.getElementById('genders_d').value = contactInfo.gender;
        document.getElementById('prename_d').value = contactInfo.firstName;
        document.getElementById('name_d').value = contactInfo.lastName;
        document.getElementById('street_d').value = contactInfo.street;
        document.getElementById('house_d').value = contactInfo.house;
        document.getElementById('postcode_d').value = contactInfo.postcode;
        document.getElementById('city_d').value = contactInfo.city;
        document.getElementById('county_d').value = contactInfo.country;
        document.getElementById('email_d').value = contactInfo.email;
        document.getElementById('other_d').value = contactInfo.other;
        document.getElementById('privateBox_d').value = contactInfo.private;

        oldContactInfo = contactInfo;
    } else {
        alert('Keine Berechtigung zum Bearbeiten oder Löschen!')
    }
}

async function updateContact() {
    const updatedContact = getContactData();

    const valid = await contactAddressValid(updatedContact.street, updatedContact.house, updatedContact.city)
    if (valid) {
        if (activeUser.admin) {
            users.forEach(element => {
                for (let index = 0; index < element.contacts.length; index++) {
                    if (element.contacts[index] == oldContactInfo) {
                        element.contacts[index] = updatedContact;
                        disableUpdateView();
                        enableAdminView();
                    }
                }
            });
        }
        else {
            for (let index = 0; index < activeUser.contacts.length; index++) {
                if (activeUser.contacts[index] == oldContactInfo) {
                    activeUser.contacts[index] = updatedContact;
                    disableUpdateView();
                    enableAdminView();
                }
            }
        }
    } else {
        alert('Aufgrund von Anforderungen an den Beleg können keine Fantasie-Adressen akzeptiert werden.');
    }
}

function getContactData() {

    let title = document.getElementById('title_d').value;
    let gender = document.getElementById('genders_d').value;
    let firstname = document.getElementById('prename_d').value;
    let lastName = document.getElementById('name_d').value;
    let street = document.getElementById('street_d').value;
    let house = parseInt(document.getElementById('house_d').value);
    let postcode = parseInt(document.getElementById('postcode_d').value);
    let city = document.getElementById('city_d').value;
    let country = document.getElementById('county_d').value;
    let email = document.getElementById('email_d').value;
    let other = document.getElementById('other_d').value;
    let private = document.getElementById('privateBox_d').checked;

    let contact = new Contact(title, gender, firstname, lastName, street, house, postcode, city, country, email, other, private);
    return contact;
}

function deleteContact() {
    if (activeUser.admin == true) {
        users.forEach(element => {
            for (let index = 0; index < element.contacts.length; index++) {
                if (element.contacts[index] == oldContactInfo) {
                    element.contacts.splice(index, 1);
                    disableUpdateView();
                    enableAdminView();
                }
            }
        });
    }
    else {
        for (let index = 0; index < activeUser.contacts.length; index++) {
            if (activeUser.contacts[index] == oldContactInfo) {
                activeUser.contacts.splice(index, 1);
                disableUpdateView();
                enableAdminView();
            }
        }
    }
}

function getContactDataNewContact() {

    let title = document.getElementById('title').value;
    let gender = document.getElementById('genders').value;
    let firstname = document.getElementById('prename').value;
    let lastName = document.getElementById('name').value;
    let street = document.getElementById('street').value;
    let house = parseInt(document.getElementById('house').value);
    let postcode = parseInt(document.getElementById('postcode').value);
    let city = document.getElementById('city').value;
    let country = document.getElementById('county').value;
    let email = document.getElementById('email').value;
    let other = document.getElementById('other').value;
    let private = document.getElementById('privatebox').checked;
    let contact = new Contact(title, gender, firstname, lastName, street, house, postcode, city, country, email, other, private);
    return contact;

}

function showAddDialog() {
    disableAdminView();
    enableAddnew_dialog();
    if (activeUser.admin == true) {
        let userSelection = document.getElementById('users');
        userSelection.style.display = 'initial';
    }
}

async function addContact() {
    const newContact = getContactDataNewContact();
    const valid = await contactAddressValid(newContact.street, newContact.house, newContact.city);
    if (valid) {
        if (activeUser.admin == true) {
            let userSelection = document.getElementById('users').value;
            users.forEach(element => {
                if (element.username == userSelection) {
                    element.contacts.push(newContact);
                }
            });
        } else {
            activeUser.contacts.push(newContact);
        }
        disableAddnew_dialog();
        enableAdminView();
    } else {
        alert('Aufgrund von Anforderungen an den Beleg können keine Fantasie-Adressen akzeptiert werden.');
    }
}

function greeting() {
    let title = document.getElementById('greeting').innerHTML = "Hallo " + activeUser.username;
}

async function contactAddressValid(street, house, city) {
    let methodstreet = street;
    let methodhouse = house;
    let methodcity = city;
    let call = "https://api.tomtom.com/search/2/geocode/" + methodstreet + "%20" + methodhouse + "%20" + methodcity + ".json?countrySet=DE&key=uPEVVjJEplE0v14jGXIeRVhKOKjfVFtJ"
    const request = new Request(call);
    const url = request.url;
    const method = request.method;
    let valid = false;
    const response = await fetch(call);
    const json = await (response.json());
    await json.results.forEach(result => {
        if (result.type == "Point Address") {
            valid = true;
        };
    });
    return valid;
}