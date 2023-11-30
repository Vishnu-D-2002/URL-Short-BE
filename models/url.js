const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longURL: String,
    shortURL: String
}, { versionKey: false });

const URL_Short = mongoose.model('URL-Short', urlSchema);

module.exports = URL_Short;