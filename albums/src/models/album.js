const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
    _id: new mongoose.Types.ObjectId(),
    number: { type: Number, unique: true, dropDups: true },
    year: Number,
    title: String,
    artist: String
});

module.exports = mongoose.model('Album', albumSchema);