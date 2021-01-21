const express = require('express')
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
router.use(bodyParser.json());

const User = require('../models/user');
const Contacts = require('../models/contacts');
const { Mongoose, isValidObjectId } = require('mongoose');
mongoose.set('useFindAndModify', false);


router.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/index.html'));
});


router.post('/login', (req, res) => {
    User.find({ userid: req.body.username })
        .exec()
        .then(user => {
            if (req.body.password == user[0].password) {
                res.status(200).json({
                    user: user[0]
                });
            }
            else {
                res.status(401).send();
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//create new Contact
router.post('/contacts', (req, res) => {
    console.log(req.body);
    const contacts = new Contacts({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        gender: req.body.gender,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        street: req.body.street,
        house: req.body.house,
        postcode: req.body.postcode,
        city: req.body.city,
        country: req.body.country,
        email: req.body.email,
        other: req.body.other,
        private: req.body.private,
        geoCoord: req.body.geoCoord,
        owner: req.body.owner
    });
    contacts
        .save()
        .then(result => {
            res.location('/contacts/' + result._id);
            res.status(201).json({
                contactID: result._id
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//Read contacts
//localhost:80/adviz/contacts?userId=Normalo
router.get('/contacts', (req, res) => {
    const contactOwner = req.query.userId;
    Contacts.find({ owner: contactOwner })
        .exec()
        .then(contacts => {
            if (contacts) {
                res.type('application/json');
                res.status(200).json({
                    contacts
                });
            }
            else {
                res.status(404).json({
                    message: 'User has no contacts'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//update contacts
router.patch('/contacts/:id', (req, res) => {
    const id = req.params.id;
    Contacts.findOneAndUpdate({ _id: id }, {
        $set: {
            title: req.body.title,
            gender: req.body.gender,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            street: req.body.street,
            house: req.body.house,
            postcode: req.body.postcode,
            city: req.body.city,
            country: req.body.country,
            email: req.body.email,
            other: req.body.other,
            private: req.body.private,
            geoCoord: req.body.geoCoord,
            owner: req.body.owner
        }
    })
        .exec()
        .then(contacts => {
            if (contacts) {
                res.status(204).send();
            }
            else {
                res.status(404).send();
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//delete contacts
router.delete('/contacts/:id', (req, res) => {
    const id = req.params.id;

    Contacts.remove({ _id: id })
        .exec()
        .then(contacts => {
            if (contacts) {
                res.status(204).send();
            }
            else {
                res.status(404).send();
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// Read  all users
// localhost:80/adviz/users
//ACHTUNG userid ist hier der name , war so vorgegeben
router.get('/users', (req, res) => {
    User.find()
        .select('userid -_id')
        .exec()
        .then(user => {
            if (user) {
                res.type('application/json');
                res.status(200).json({
                    usernames: user
                });
            }
            else {
                res.status(404).send();
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//get all Contacts
//localhost:80/adviz/allContacts
//body : admin: true/false name: "Admina/Normalo"
router.post('/allContacts', (req, res) => {
    const name = req.body.name;
    const admin = req.body.admin;
    var findCondition = { $or: [{ owner: name, }, { private: false }] };

    if (name && admin == true) {
        findCondition = {}
    }

    console.log(name, admin);

    Contacts.find(findCondition)
        .exec()
        .then(contacts => {
            if (contacts) {
                res.type('application/json');
                res.status(200).json({
                    contacts
                });
            }
            else {
                res.status(404).json({
                    message: 'User has no contacts'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;

