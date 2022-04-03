const express = require("express"),
    router = express.Router(),
    albumCtrl = require("./album-controller");

router.post('/albums', albumCtrl.addAlbum);
router.get('/albums', albumCtrl.getAlbums);

module.exports = router;