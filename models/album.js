const mongoose = require('mongoose');

// Album schema model
const albumSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    number: { type: Number, unique: false },
    year: Number,
    title: String,
    artist: String
});

module.exports = mongoose.model('Album', albumSchema);
