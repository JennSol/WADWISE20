const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    gender: String,
    firstname: String,
    lastname: String,
    street: String,
    house: Number,
    postcode: Number,
    city: String,
    country: String,
    email: String,
    other: String,
    private: Boolean,
    geoCoord: Array,
    owner: String
});

module.exports = mongoose.model('Contacts', contactSchema);