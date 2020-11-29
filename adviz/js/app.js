var mymap = L.map('map').setView([52.456009, 13.527571], 14);
var marker = L.marker([52.456009, 13.527571]).addTo(mymap);
var contact_Map = new Map();

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

let mueller = new Contact(null, 'male', 'Hans', 'Mueller', 'Berliner Allee', 261, 13088, 'Berlin', 'Deutschland', 'Mueller@mail.de', null, true);
let neumann = new Contact(null, 'female', 'Susi', 'Neumann', 'Landsberger Allee', 320, 10365, 'Berlin', 'Deutschland', 'Neumann@gmail.de', null, false);
let schuster = new Contact(null, 'male', 'Robert', 'Schuster', 'Oberfeldstraße', 91, 12683, 'Berlin', 'Deutschland', 'Schuster@hotmail.de', null, true);
let mayer = new Contact(null, 'female', 'Anne', 'Mayer', 'Bernauer Str.', 50, 10435, 'Berlin', 'Deutschland', 'Mayer@outlook.de', null, false);

function generateUsers() {
    let admina = new User('admina', 'abc', [mueller, neumann], true);
    let normalo = new User('normalo', 'abc', [schuster, mayer], false);
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
    users.forEach(element => {
        if (username == element.username && password == element.password) {
            loginSuccessful(element);
        }
    });
}

function loginSuccessful(activeUser) {
    disableLoginView();
    enableAdminView(activeUser);
}

function disableLoginView() {
    loginview = document.getElementById('login_view');
    loginview.style.display = 'none';

}

function enableAdminView(activeUser) {
    adminview = document.getElementById('admin_view');
    adminview.style.display = 'initial';
    mymap.invalidateSize();
    showMyContacts(activeUser);
}

function login() {
    let password = document.getElementById('password').value;
    let username = document.getElementById('user_name').value;
    authenticate(username, password);
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

function showMyContacts(activeUser) {
    let counter = 0;
    contactList = document.getElementById('contact_list');
    activeUser.contacts.forEach(element => {
        contact_Map.set(counter, element);
        let li = document.createElement("li");
        let contactInfo = document.createTextNode(element.firstName + " " + element.lastName);
        li.appendChild(contactInfo);
        li.id = counter;
        li.addEventListener("click", function (event) {
            id = event.target.id;
            openUpdateScreen(id);
        }
        )
        contactList.appendChild(li);
        counter++;
    });
}

function clearContactList() {
    let contactList = document.getElementById('contact_list');
    while (contactList.firstChild) {
        contactList.removeChild(contactList.firstChild);
    }
}

function openUpdateScreen(id) {
    let updateScreen = document.getElementById('delete_update_screen');
    disableAdminView();
    updateScreen.style.display = 'initial';
    let contactInfo = contact_Map.get(parseInt( id));
    document.getElementById('title_d').value = contactInfo.title;
    document.getElementById('genders_d').value= contactInfo.gender;
    document.getElementById('prename_d').value = contactInfo.firstName;
    document.getElementById('name_d').value=  contactInfo.lastName;
    document.getElementById('street_d').value= contactInfo.street;
    document.getElementById('house_d').value= contactInfo.house;
    document.getElementById('postcode_d').value= contactInfo.postcode;
    document.getElementById('city_d').value= contactInfo.city;
    document.getElementById('county_d').value= contactInfo.country;
    document.getElementById('email_d').value= contactInfo.email;
    document.getElementById('other_d').value= contactInfo.other;
    document.getElementById('privateBox_d').value= contactInfo.private;

}


