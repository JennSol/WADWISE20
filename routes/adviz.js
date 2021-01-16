const express = require('express')
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
router.use(bodyParser.json());

const User = require('../models/user');
const Contact = require('../models/contact');
const { Mongoose, isValidObjectId } = require('mongoose');


router.get('/', (req,res) =>{       
    res.sendFile(path.resolve('./public/index.html'));
});


router.post('/login', (req,res) =>{
    User.find({ userid: req.body.name})
    .exec( )
    .then(user => {
      if (req.body.password == user[0].password){
        res.status(200).json({
           user: user[0]
        });
      }
      else{
          res.status(401).send();
      }
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
});

//create new Contact
router.post('/contacts',(req,res) =>{
    const contact = new Contact({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        gender: req.body.gender,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        street: req.body.street,
        house: req.body.house,
        postcode: req.body.postcode,
        city: req.body.city,
        country: req.body.country,
        email: req.body.email,
        other: req.body.other,
        private: req.body.private,
        geoCord: req.body.geoCord,
        owner: req.body.owner
    });
    contact.save();
    res.location('/contacts/' + contact._id);
    res.status(201).json({
        contactID: contact._id
    });
});

module.exports = router;

