const express = require("express"),
    router = express.Router(),
    albumCtrl = require("./album-controller");

/**
*   Routes defined
*/
router.post('/albums', albumCtrl.addAlbum);             // INSERT ONE
router.get('/albums', albumCtrl.getAlbums);             // FIND MANY
router.get('/albums/:number', albumCtrl.getAlbum);      // FIND ONE 
router.put('/albums/:id', albumCtrl.updateAlbum);       // UPDATE ONE
router.put('/albums', albumCtrl.updateMultipleAlbums);  // UPDATE MANY
router.delete('/albums/:id', albumCtrl.deleteAlbum);    // DELETE ONE
router.get('/help', albumCtrl.help);                    // HELP

module.exports = router;
