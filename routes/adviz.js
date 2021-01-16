const express = require('express')
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
router.use(bodyParser.json());

const User = require('../models/user');
const Contacts = require('../models/contacts');
const { Mongoose, isValidObjectId } = require('mongoose');


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
    const contacts = new Contacts({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        gender: req.body.gender,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
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
router.get('/contacts', (req, res) => {
    const contactOwner = req.query.userId;
    Contacts.find({ owner : contactOwner})
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

    Contacts.findOneAndUpdate({ _id : id},{ $set: { 
        title: req.body.title,
        gender: req.body.gender,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        street: req.body.street,
        house: req.body.house,
        postcode: req.body.postcode,
        city: req.body.city,
        country: req.body.country,
        email: req.body.email,
        other: req.body.other,
        private: req.body.private,
        geoCord: req.body.geoCoord,
        owner: req.body.owner }
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

//update contacts
router.delete('/contacts/:id', (req, res) => {
    const id = req.params.id;

    Contacts.remove({ _id : id})
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
module.exports = router;
