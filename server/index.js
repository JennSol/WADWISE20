const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const app = express();
const port = 80;
const advizRouter = require('./routes/adviz');
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/advizDB',
    {
        useUnifiedTopology: true
    }
);
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/adviz', advizRouter);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
module.exports = app;