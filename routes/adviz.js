const express = require('express')
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/', (req,res) =>{       
    res.sendFile(path.resolve('./public/index.html'));
});

router.post('/login', (req,res) =>{  
    console.log(req.body.user.name);
    console.log(req.body.user.password);
    if(authorized){
        res.status(200).send('authorized');
    }else{
        res.status(401).send('not authorized');
    }

});

module.exports = router;

