var mymap = L.map('map').setView([52.456009, 13.527571], 14);
var contact_Map = new Map();
var activeUser;
var oldContactInfo;
var markers = new Map();
let neumann = new Contact(null, 'female', 'Susi', 'Neumann', 'Landsberger Allee', 320, 10365, 'Berlin', 'Deutschland', 'Neumann@gmail.de', null, false);
let schuster = new Contact(null, 'male', 'Robert', 'Schuster', 'Oberfeldstraße', 91, 12683, 'Berlin', 'Deutschland', 'Schuster@hotmail.de', null, true);
let mayer = new Contact(null, 'female', 'Anne', 'Mayer', 'Bernauer Str.', 50, 10435, 'Berlin', 'Deutschland', 'Mayer@outlook.de', null, false);
let mueller = new Contact(null, 'male', 'Hans', 'Mueller', 'Berliner Allee', 261, 13088, 'Berlin', 'Deutschland', 'Mueller@mail.de', null, true);
let users = generateUsers();

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

function generateUsers() {
    let admina = new User('Admina', 'a', [mueller, neumann], true);
    let normalo = new User('Normalo', 'a', [schuster, mayer], false);
    return [admina, normalo];
}

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
        if (!authenticated && username == element.username && password == element.password) {
            activeUser = element;
            authenticated = true;
        }
    });
    if (authenticated) {
        loginSuccessful();
    } else {
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

function enableAddNewDialogTemplate() {
    document.getElementById('addnew_dialog').style.display = 'initial';

    let dialogTemplate = document.getElementById('add-edit-delete-dialog-template')
    let dialog = dialogTemplate.content;
    dialog.querySelector('.form_dialog').setAttribute('onsubmit', 'addContact(); return false;')
    let barTemplateContent = document.getElementById('bar-add-template').content;
    let bar = dialog.querySelector('.bar');
    bar.append(barTemplateContent);

    dialog.querySelector('#title').value = '';
    dialog.querySelector('#genders').value = '';
    dialog.querySelector('#prename').value = '';
    dialog.querySelector('#name').value = '';
    dialog.querySelector('#street').value = '';
    dialog.querySelector('#house').value = '';
    dialog.querySelector('#postcode').value = '';
    dialog.querySelector('#city').value = '';
    dialog.querySelector('#county').value = '';
    dialog.querySelector('#email').value = '';
    dialog.querySelector('#other').value = '';

    document.getElementById('addnew_dialog').append(dialog.cloneNode(true));
}

function disableAddnew_dialog() {
    let dialog = document.getElementById('addnew_dialog');

    dialog.removeChild(dialog.querySelector('.form_dialog'));

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
    let template = document.getElementById('contact-template');
    let entry = template.content;
    let li = entry.querySelector('li');
    li.id = counter;
    entry.querySelector('a').innerText = element.firstName + " " + element.lastName;
    let call = "https://api.tomtom.com/search/2/geocode/" + element.street + "%20" + element.house + "%20" + element.city + ".json?limit=1?countrySet=DE&key=uPEVVjJEplE0v14jGXIeRVhKOKjfVFtJ"
    const request = new Request(call);
    fetch(request)
        .then(response => response.json())
        .then(json => {
            let contactAddedToMap = false;
            json.results.forEach(result => {
                if (result.type == "Point Address" && !contactAddedToMap) {
                    let newMarker = L.marker([parseFloat(result.position.lat), parseFloat(result.position.lon)]);
                    markers.set(parseInt(counter), newMarker);
                    newMarker.addTo(mymap).bindPopup('<b>' + element.firstName + " " + element.lastName + "</b><br>" + element.street + " " + element.house + ", " + element.postcode);
                    contactAddedToMap = true;
                };
            });
        });
    document.getElementById('contact_list').appendChild(entry.cloneNode(true));
}

function removeAllMarkersFromMap() {
    markers.forEach(element => {
        mymap.removeLayer(element);
    });
    markers.clear();
}

function showMyContacts() {
    clearContactList();
    let counter = 0;
    contact_Map.clear();
    removeAllMarkersFromMap();
    activeUser.contacts.forEach(element => {
        addContactToContactList(counter, element);
        addEventListenersToContactListEntry(counter, element);
        counter++;
    });
}

function addEventListenersToContactListEntry(id, contact) {
    let listitems = document.getElementById('contact_list').getElementsByTagName('li');
    let li = listitems[id];
    li.addEventListener("click", function (event) {
        if (event.target.icontype == 'delete') {
            if (confirm(contact.firstName + ' ' + contact.lastName + ' löschen?')) {
                deleteContactById(id);
            }
        } else if (event.target.icontype == 'edit') {
            openUpdateScreen(id);
        }
        else {
            openUpdateScreen(id);
        }
    });
    li.addEventListener("mouseover", function (event) {
        if (event.target.id == undefined) {
            //getting toplevel id
            id = event.target.parent('.entryTopLevel').id;
        }
        let marker = markers.get(id);
        marker.bindPopup('<b>' + contact.firstName + " " + contact.lastName + "</b><br>" + contact.street + " " + contact.house + ", " + contact.postcode).openPopup();
    });
    li.addEventListener("mouseleave", function (event) {
        if (event.target.id == undefined) {
            id = event.target.parent('.entryTopLevel').id;
        }
        let marker = markers.get(id);
        marker.closePopup();
    });


}
function showAllContacts() {
    clearContactList();
    let counter = 0;
    contact_Map.clear();
    removeAllMarkersFromMap();
    users.forEach(user => {
        user.contacts.forEach(element => {
            if (isMyContact(element) == true || !element.private || activeUser.admin && element.private) {
                addContactToContactList(counter, element);
                addEventListenersToContactListEntry(counter, element);
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
    if (contactInfo != undefined) {
        if (isMyContact(contactInfo) == true || activeUser.admin == true) {
            disableAdminView();
            
            let childs = document.getElementById('delete_update_screen');
            while (childs.firstChild) {
                childs.removeChild(childs.lastChild);
            }

            document.getElementById('delete_update_screen').style.display = 'initial';
            let dialogTemplate = document.getElementById('add-edit-delete-dialog-template');
            let dialog = dialogTemplate.content;
            dialog.querySelector('.form_dialog').setAttribute('onsubmit', 'updateContact();return false');
            let barTemplateContent = document.getElementById('bar-add-template').content;
            let bar = dialog.querySelector('.bar');
            bar.append(barTemplateContent);
            dialog.querySelector('#title').value = contactInfo.title;
            dialog.querySelector('#genders').value = contactInfo.gender;
            dialog.querySelector('#prename').value = contactInfo.firstName;
            dialog.querySelector('#name').value = contactInfo.lastName;
            dialog.querySelector('#street').value = contactInfo.street;
            dialog.querySelector('#house').value = contactInfo.house;
            dialog.querySelector('#postcode').value = contactInfo.postcode;
            dialog.querySelector('#city').value = contactInfo.city;
            dialog.querySelector('#county').value = contactInfo.country;
            dialog.querySelector('#email').value = contactInfo.email;
            dialog.querySelector('#other').value = contactInfo.other;
            bar.querySelector('#privatebox').value = contactInfo.private;

            oldContactInfo = contactInfo;

            document.getElementById('delete_update_screen').append(dialog.cloneNode(true));

        }
        else {
            alert('Keine Berechtigung zum Bearbeiten oder Löschen!')
        }
    }


}

function oldopenUpdateScreen(id) {
    let contactInfo = contact_Map.get(parseInt(id));
    if (contactInfo != undefined) {
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
    let updateDialog = document.getElementById('delete_update_screen');
    let title = updateDialog.querySelector('#title').value;
    let gender = updateDialog.querySelector('#genders').value;
    let firstname = updateDialog.querySelector('#prename').value;
    let lastName = updateDialog.querySelector('#name').value;
    let street = updateDialog.querySelector('#street').value;
    let house = parseInt(updateDialog.querySelector('#house').value);
    let postcode = parseInt(updateDialog.querySelector('#postcode').value);
    let city = updateDialog.querySelector('#city').value;
    let country = updateDialog.querySelector('#county').value;
    let email = updateDialog.querySelector('#email').value;
    let other = updateDialog.querySelector('#other').value;
    let private = updateDialog.querySelector('#privatebox').checked;

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

function deleteContactById(id) {
    oldContactInfo = contact_Map.get(id);
    deleteContact();
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
    enableAddNewDialogTemplate();
    let userSelection = document.getElementById('users');
    if (activeUser.admin == true) {
        userSelection.style.display = 'initial';
    }
    else {
        userSelection.style.display = 'none';
    }
}

async function addContact() {
    const newContact = getContactDataNewContact();
    let valid = false;
    try {
        valid = await contactAddressValid(newContact.street, newContact.house, newContact.city);
    } catch {
        valid = true;
    }
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
    document.getElementById('greeting').innerHTML = "Hallo " + activeUser.username;
}

async function contactAddressValid(street, house, city) {
    let methodstreet = street;
    let methodhouse = house;
    let methodcity = city;
    let call = "https://api.tomtom.com/search/2/geocode/" + methodstreet + "%20" + methodhouse + "%20" + methodcity + ".json?countrySet=DE&key=uPEVVjJEplE0v14jGXIeRVhKOKjfVFtJ"
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