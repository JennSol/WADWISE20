const express = require('express')
const path = require('path');

const app = express()
const port = 80
var advizRouter = require('./routes/adviz');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/adviz', advizRouter);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
module.exports = app;