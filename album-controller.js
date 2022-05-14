const Album = require('./models/album'),
    mongodb = require('./mongodb.js'),
    mongoose = require('mongoose');


exports.help = function(req, res) {
    res.json({
        message: "Welcome to the top 500 albums of all time. Try adding '/albums' at the end of the link to get the full list!"
    });
}

exports.updateMultipleAlbums = function(req, res) {
    let albums = req.body.json;
    albums.forEach((album) => {
        Album.findOneAndUpdate({number: album.number}, req.body, {new: true},function (err, album) {
            if (err) {
              res.status(400).json(err);
            } 
          }); 
    });
    res.json(albums);
};

exports.addAlbum = function(req, res) {
    console.log('POST /albums');
    console.log(req.body);
    let newAlbum = new Album(req.body);
    console.log(newAlbum);

    newAlbum.save(function (err, album) {
        if (err) res.status(400).json(err);
        res.json(album);
    });
};

exports.getAlbums = function(req, res) {
    console.log(req.body);
    console.log('GET /albums')
    Album.find({}, function(err, albums) {
        if (err) {
            res.status(400).json(err);
        }
        res.json(albums);
    });
};

exports.getAlbum = function(req, res) {
    Album.findOne({number: req.params.number}, function(err, album) {
        if (err) {
            res.status(400).json(err);
        }
        res.json(album);
    }
    );
};

exports.updateAlbum = function(req, res) {
    console.log('UPDATE /albums/' + req.params.id);
    console.log(req.body);
    Album.findOneAndUpdate({_id: new mongoose.Types.ObjectId(req.params.id)}, req.body, {new: true},function (err, album) {
      if (err) {
        res.status(400).json(err);
      } 
      res.json(album);
    }); 
}

exports.deleteAlbum = function(req, res) {
    console.log('DELETE /albums/' + req.params.id)
    Album.findOneAndRemove({_id: new mongoose.Types.ObjectId(req.params.id)}, function (err, album) {
        if (err) {
          res.status(400).json(err);
        } 
        res.json(album);
      }); 
}