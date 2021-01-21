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

function User(username, password, contacts, admin) {
    this.username = username;
    this.password = password;
    this.contacts = contacts;
    this.admin = admin;
};

function Contact(title, gender, firstName, lastName, street, house,
    postcode, city, country, email, other, private, id = null, owner) {
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
    this.id = id;
    this.owner = owner;
}

function generateUsers() {
    let admina = new User('Admina', 'a', [mueller, neumann], true);
    let normalo = new User('Normalo', 'a', [schuster, mayer], false);

}

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

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response; // parses JSON response into native JavaScript objects
}

async function login() {
    let passwordFromForm = document.getElementById('password').value;
    let username = document.getElementById('user_name').value;
    let json = {
        username: username,
        password: passwordFromForm
    };
    postData('/adviz/login', json).then(data => {
        if (data.status == 200) {
            data.json().then(payload => {
                console.log(payload);
                //console.log(payload);
                //let user = JSON.parse(payload);
                //JSON.parse(payload, (key, value) => {
                //    console.log(key + ' ' + value); 
                //    return value;
                //});
                activeUser = new User(payload.user.userid, null, null, payload.user.admin);
                console.log('Logged in as user ' + activeUser.username);
                loginSuccessful();
            });
        }
        else if (data.status == 401) {
            alert('Benutzername oder Passwort inkorrekt');
        }
    });
}

function getContactArrayFromJson(json) {

    let contacts = []
    json.forEach(contact => {
        let contactFromJson = new Contact(contact.title, contact.gender, contact.firstName, contact.lastName,
            contact.street, contact.house, contact.postcode, contact.city, contact.county, contact.email, contact.other, contact.private);
        contacts.push(contactFromJson);
    });
    return contacts;
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
    while (bar.firstChild) {
        bar.removeChild(bar.lastChild);
    }
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

function jsonToContact(json) {
    return new Contact(json.title, json.gender, json.firstname, json.lastname, json.street, json.house, json.postcode,
        json.city, json.country, json.email, json.other, json.private, json._id, json.owner);
}

async function showMyContacts() {
    removeAllMarkersFromMap();
    await fetch('/adviz/contacts?userId=' + activeUser.username).then(function (data) {
        clearContactList();
        let counter = 0;
        contact_Map.clear();
        removeAllMarkersFromMap();
        data.json().then(payload => {
            payload.contacts.forEach(json => {
                let contact = jsonToContact(json);
                addContactToContactList(counter, contact);
                addEventListenersToContactListEntry(counter, contact);
                counter++;
            });
        });
    });
}

function addEventListenersToContactListEntry(id, contact) {
    let listitems = document.getElementById('contact_list').getElementsByTagName('li');
    let li = listitems[id];
    li.addEventListener("click", function (event) {
        let icontype= '';
        if(event.target.attributes.icontype!=undefined){
            icontype=event.target.attributes.icontype.nodeValue;
        }
        if (icontype == 'delete') {
            if (confirm(contact.firstName + ' ' + contact.lastName + ' löschen?')) {
                deleteContactById(id);
            }
        } else if (icontype == 'edit') {
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
    let json = {
        name: activeUser.username,
        admin: activeUser.admin
    }
    postData(url = '/adviz/allContacts', json).then(data => {
        data.json().then(payload => {
            //console.log(payload);
            payload.contacts.forEach(json => {
                let contact = jsonToContact(json);
                console.log(contact);
                addContactToContactList(counter, contact);
                addEventListenersToContactListEntry(counter, contact);
                counter++;
            });
        });
    });
}

function isMyContact(contact) {
    return contact.owner == activeUser.username;
}

function clearContactList() {
    let contactList = document.getElementById('contact_list');
    while (contactList.firstChild) {
        contactList.removeChild(contactList.firstChild);
    }
}

function openUpdateScreen(id) {

    let contactInfo = contact_Map.get(parseInt(id));
    oldContactInfo = contactInfo;
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
            let barTemplateContent = document.getElementById('bar-update-delete-template').content;
            let bar = dialog.querySelector('.bar');
            while (bar.firstChild) {
                bar.removeChild(bar.lastChild);
            }
            bar.append(barTemplateContent.cloneNode(true));
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

async function updateContact() {
    console.log('oldContact: ' + oldContactInfo);

    const updatedContact = getContactData();
    console.log('updatedContact: ' + updatedContact);

    let json = {
        title: updatedContact.title,
        gender: updatedContact.gender,
        firstname: updatedContact.firstName,
        lastname: updatedContact.lastName,
        street: updatedContact.street,
        house: updatedContact.house,
        postcode: updatedContact.postcode,
        city: updatedContact.city,
        country: updatedContact.country,
        email: updatedContact.email,
        other: updatedContact.other,
        private: updatedContact.private,
        geoCoord: null,
        owner: oldContactInfo.owner
    }

    const valid = await contactAddressValid(updatedContact.street, updatedContact.house, updatedContact.city)
    if (valid) {
        if (activeUser.admin) {

            await fetch('/adviz/contacts/' + oldContactInfo.id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(json),
            }).then(response => {
                console.log(response.status);
                disableUpdateView();
                enableAdminView();
            });
        }
        else {
            if (oldContactInfo.owner == activeUser.username) {
                await fetch('/adviz/contacts/' + oldContactInfo.id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(json),
                }).then(response => {
                    console.log(response.status);
                    disableUpdateView();
                    enableAdminView();
                });
            } else {
                alert('Aufgrund von Anforderungen an den Beleg können keine Fantasie-Adressen akzeptiert werden.');
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

async function deleteContact() {
    if (activeUser.admin == true) {
        await fetch('/adviz/contacts/' + oldContactInfo.id, {
            method: 'DELETE'
        }).then(response => {
            console.log(response.status);
            disableUpdateView();
            enableAdminView();
        });
    }
    else {
        if(oldContactInfo.owner == activeUser.username){
            await fetch('/adviz/contacts/' + oldContactInfo.id, {
                method: 'DELETE'
            }).then(response => {
                console.log(response.status);
                disableUpdateView();
                enableAdminView();
            });     
        }else{
            alert('Keine Berechtigung zum Löschen!');
            disableUpdateView();
            enableAdminView();  
        }
    }
}

function deleteContactById(id) {
    console.log('deleting by id: '+id);
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

async function showAddDialog() {
    disableAdminView();
    enableAddNewDialogTemplate();
    let userSelection = document.getElementById('users');
    if (activeUser.admin == true) {
        await fetch('/adviz/users').then(response => {
            response.json().then(json => {
                json.usernames.forEach(user => {
                    console.log(user.userid);
                    let option = document.createElement('option');
                    option.text = user.userid;
                    userSelection.add(option);
                });
                userSelection.style.display = 'initial';
            });
        });

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
        valid = false;
    }
    if (valid) {
        let json = {
            title: newContact.title,
            gender: newContact.gender,
            firstname: newContact.firstName,
            lastname: newContact.lastName,
            street: newContact.street,
            house: newContact.house,
            postcode: newContact.postcode,
            city: newContact.city,
            country: newContact.country,
            email: newContact.email,
            other: newContact.other,
            private: newContact.private,
            geoCoord: null,
            owner: null
        };
        if (activeUser.admin == true) {
            let userSelection = document.getElementById('users').value;
            json.owner = userSelection;

        } else {
            json.owner = activeUser.username;
            activeUser.contacts.push(newContact);
        }
        postData('/adviz/contacts', json).then(data => {
            if (data.status == 201) {
                console.log('new contact added');
            }
        });
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