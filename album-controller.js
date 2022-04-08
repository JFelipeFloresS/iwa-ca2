const Album = require('./models/album');

exports.test = function(req, res) {
    res.json({
        message: "Welcome to the top 500 albums of all time. Try adding '/album' at the end of the link to get the full list!"
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
    let newAlbum = new Album(req.body);
    newAlbum.save(function (err, album) {
        if (err) res.status(400).json(err);
        res.json(album);
    });
};

exports.getAlbums = function(req, res) {
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
    Album.findOneAndUpdate({number: req.params.number}, req.body, {new: true},function (err, album) {
      if (err) {
        res.status(400).json(err);
      } 
      res.json(album);
    }); 
}

exports.deleteAlbum = function(req, res) {
    Album.findOneAndRemove({number: req.params.number}, function (err, album) {
        if (err) {
          res.status(400).json(err);
        } 
        res.json(album);
      }); 
}