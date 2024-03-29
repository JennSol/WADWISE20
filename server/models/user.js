const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: String,
    password: String,
    firstName: String,
    lastName: String,
    admin: Boolean
});

module.exports = mongoose.model('User', userSchema);