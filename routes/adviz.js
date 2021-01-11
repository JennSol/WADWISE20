const express = require('express')
const path = require('path');
const router = express.Router();

router.get('/', (req,res) =>{   //    /adviz
    res.sendFile(path.resolve('./public/index.html'));
});

router.get('/login', (req,res) =>{  //  /adviz/login
    
});


module.exports = router;

