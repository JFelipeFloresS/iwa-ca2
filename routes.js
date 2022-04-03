const express = require("express"),
    router = express.Router(),
    albumCtrl = require("./album-controller");

router.post('/albums', albumCtrl.addAlbum);
router.get('/albums', albumCtrl.getAlbums);
router.get('/albums/:number', albumCtrl.getAlbum);
router.put('/albums/:number', albumCtrl.updateAlbum);
router.delete('/albums/:number', albumCtrl.deleteAlbum);
router.get('/', albumCtrl.test);

module.exports = router;