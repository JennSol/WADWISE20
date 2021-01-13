const express = require('express')
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

//contacts
let neumann = new Contact(null, 'female', 'Susi', 'Neumann', 'Landsberger Allee', 320, 10365, 'Berlin', 'Deutschland', 'Neumann@gmail.de', null, false);
let schuster = new Contact(null, 'male', 'Robert', 'Schuster', 'Oberfeldstraße', 91, 12683, 'Berlin', 'Deutschland', 'Schuster@hotmail.de', null, true);
let mayer = new Contact(null, 'female', 'Anne', 'Mayer', 'Bernauer Str.', 50, 10435, 'Berlin', 'Deutschland', 'Mayer@outlook.de', null, false);
let mueller = new Contact(null, 'male', 'Hans', 'Mueller', 'Berliner Allee', 261, 13088, 'Berlin', 'Deutschland', 'Mueller@mail.de', null, true);

//users
let admina = new User('Admina', 'a', [mueller, neumann], true);
let normalo = new User('Normalo', 'a', [schuster, mayer], false);
let users = [admina, normalo];

function User(username, password, contacts, admin) {
    this.username = username;
    this.password = password;
    this.contacts = contacts;
    this.admin = admin;
};

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

router.get('/', (req,res) =>{       
    res.sendFile(path.resolve('./public/index.html'));
});


router.post('/login', (req,res) =>{
    let username = req.body.user.name;
    let password = req.body.user.password;
    console.log('Login occured with name '+username + ' and password '+password);  
    if(isAuthenticated(username, password)){
        console.log('authenticated');
        res.status(200).json(getUserAndContactsJson(username));
    }else{
        console.log('not authenticated');
        res.status(401).send();
    }
});

function isAuthenticated(username, password){
    for (let i = 0; i<users.length; i++){
        let user = users[i];
        if(user.username == username && user.password == password){
            return true;
        }
    }
    return false;
}

function getUserAndContactsJson(username){

    //hier kannst du schalten und walten, bitte darauf achten dass du ungefähr
    //diese struktur beibehältst, außer es spricht ein guter grund dagegen.
    //Du kannst also alles was hier drinsteht umschreiben, es diente mir nur 
    //zum mocken der DB
    let admina = new User('Admina', 'a', [mueller, neumann], true);
    let normalo = new User('Normalo', 'a', [schuster, mayer], false);
    let adminaJson = {
        user:{
            name: admina.username,
            admin:  admina.admin
        },
        contacts: admina.contacts
    }
    let normaloJson = {
        user:{
            name: normalo.username,
            admin:  normalo.admin
        },
        contacts: normalo.contacts
    }
    if (username=='Admina'){
        return JSON.stringify(adminaJson);
    }else if (username=='Normalo'){
        return JSON.stringify(normaloJson);
    }
    
}

module.exports = router;

