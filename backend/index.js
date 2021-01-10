const express = require('express')
const path = require('path');

const app = express()
const port = 80

app.get('/adviz/login', (req,res) =>{
    res.sendFile(path.resolve('../adviz/index.html'));
});

app.get('/adviz/css/styles.css', (req,res) =>{
    res.sendFile(path.resolve('../adviz/css/styles.css'));
});

app.get('/adviz/js/app.js', (req,res) =>{
    res.sendFile(path.resolve('../adviz/js/app.js'));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
