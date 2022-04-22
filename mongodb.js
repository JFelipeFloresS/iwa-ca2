const { MongoClient, ServerApiVersion } = require('mongodb');
const album = require('./models/album');
const client = new MongoClient(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

exports.findAll = () => {
    let albums = [];
    console.log("Here");
    var connection = client.connect(err => {
        if (err) throw err;
        const collection = client.db("best-albums").collection("albums");
        

        collection.find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            albums.push(result);
        });

        console.log("Count: " + albums.length);
        if (albums.length != 0) {
            for (let i = 0; i < albums.length; i++) {
                console.log(albums[i]);
            }
        }
    });

    connection;

    return albums;
};