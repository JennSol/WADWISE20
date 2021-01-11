const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = 80;
var advizRouter = require('./routes/adviz');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/adviz', advizRouter);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
module.exports = app;