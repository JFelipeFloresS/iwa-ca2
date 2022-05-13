const express = require("express"),
    router = express.Router(),
    albumCtrl = require("./album-controller");

router.post('/albums', albumCtrl.addAlbum);
router.get('/albums', albumCtrl.getAlbums);
router.get('/albums/:number', albumCtrl.getAlbum);
router.put('/albums/:id', albumCtrl.updateAlbum);
router.put('/albums', albumCtrl.updateMultipleAlbums);
router.delete('/albums/:id', albumCtrl.deleteAlbum);
router.get('/', albumCtrl.help);

module.exports = router;