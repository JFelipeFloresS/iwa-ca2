const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    _id: { type: Number, unique: true, dropDups: true },
    year: Number,
    title: String,
    artist: String
});

module.exports = mongoose.model('Album', albumSchema);