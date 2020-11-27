var mymap = L.map('map').setView([52.456009, 13.527571], 14);
var marker = L.marker([52.456009, 13.527571]).addTo(mymap);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoia2Fyc3RlbmFic2NoaWVkIiwiYSI6ImNrZ210OGRzaDF1eTAydHRldzdzbTZ0MG8ifQ.Y8abAkOxDNR_Am3Ij1GNzw'

}).addTo(mymap);

function generateUsers() {
    let admina = new User('admin', 'abc', true);
    let normalo = new User('normalo', 'abc', false);
    return [admina, normalo];
}

let users = generateUsers();
function User(username, password, admin) {
    this.username = username;
    this.password = password;
    this.admin = admin;
};

function authenticate(username, password) {
    //hardcoded login data, normally we would call our backend here
    users.forEach(element => {
        if (username == element.username && password == element.password) {
            loginSuccessful();
        }
    });
}

function loginSuccessful(){
    disableLoginView();
    enableAdminView();    
}

function disableLoginView(){
    loginview = document.getElementById('login_view');
    loginview.style.display = 'none';
    
}

function enableAdminView(){
    adminview = document.getElementById('admin_view');
    adminview.style.display = 'block';
    mymap.invalidateSize();
}

function login() {
    let password = document.getElementById('password').value;
    let username = document.getElementById('user_name').value;
    authenticate(username, password);
}
