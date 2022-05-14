const Album = require('./models/album'),
    mongoose = require('mongoose');


exports.help = function (req, res) {
    console.log('GET /');
    res.json({
        message: "Welcome to the top 500 albums of all time. Try adding '/albums' at the end of the link to get the full list!"
    });
}

exports.updateMultipleAlbums = function (req, res) {
    console.log('PUT /albums');

    let albums = req.body;
    let errors = [];

    Object.keys(albums).forEach((id) => {
        const album = albums[id];
        Album.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {number: album.number, year: album.year, artist: album.artist, title: album.title}, { upsert: true }, function (err, album) {
            if (err) {
                console.log(err);
                errors.push(err);
            }
        });
    })

    if (errors.length > 0) res.status(400).json(errors);
    else res.json(albums);
};

exports.addAlbum = function (req, res) {
    console.log('POST /albums');
    console.log('body' + req.body);

    let newAlbum = new Album(req.body);
    console.log("Album", newAlbum);

    newAlbum.save(function (err, album) {
        console.log('err ', err);
        console.log('ijside save ', album);
        if (err) res.status(400).json(err);
        res.json(album);
    });
};

exports.getAlbums = function (req, res) {
    console.log('GET /albums');
    console.log(req.body);
    Album.find({}, function (err, albums) {
        if (err) {
            res.status(400).json(err);
        }
        res.json(albums);
    });
};

exports.getAlbum = function (req, res) {
    console.log('GET /albums/' + req.params.number);
    console.log(req.body);
    Album.findOne({ number: req.params.number }, function (err, album) {
        if (err) {
            res.status(400).json(err);
        }
        res.json(album);
    }
    );
};

exports.updateAlbum = function (req, res) {
    console.log('UPDATE /albums/' + req.params.id);
    console.log(req.body);
    Album.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.params.id) }, req.body, { new: true }, function (err, album) {
        if (err) {
            res.status(400).json(err);
        }
        res.json(album);
    });
}

exports.deleteAlbum = function (req, res) {
    console.log('DELETE /albums/' + req.params.id)
    Album.findOneAndRemove({ _id: new mongoose.Types.ObjectId(req.params.id) }, function (err, album) {
        if (err) {
            res.status(400).json(err);
        }
        res.json(album);
    });
}