const album = require('./models/album');

exports.addAlbum = function(req, res) {
    let newAlbum = new Album(req.body);
    newAlbum.save(function (err, album) {
        if (err) res.status(400).json(err);
        res.json(album);
    });
};

exports.getAlbums = function(req, res) {

};

exports.getAlbums = function(req, res) {

};

exports.updateAlbum = function(req, res) {
    
}