const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    number: { type: Number },
    year: Number,
    title: String,
    artist: String
});

module.exports = mongoose.model('Album', albumSchema);