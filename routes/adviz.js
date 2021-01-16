const express = require('express')
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const User = require('../models/user');
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

module.exports = router;

