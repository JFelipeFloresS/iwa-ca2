const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    number: { type: Number , unique: false},
    year: Number,
    title: String,
    artist: String
});

module.exports = mongoose.model('Album', albumSchema);