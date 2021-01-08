const express = require('express')

const http = require('http')
const fs = require('fs').promises;

const app = express()
const port = 80

app.use(express.static('../adviz'));

app.get('/adviz/login', (req,res) =>{
    fs.readFile('../adviz/index.html').then(contents=>{
        res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(contents);
    });
});

app.get('/adviz/contacts', (req, res) => {
    //api call would be locahost:3000/adviz/contacts?userId=<user id here>
    console.log(req.query.userId)
    res.send('Hello '+ req.query.userId )
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
