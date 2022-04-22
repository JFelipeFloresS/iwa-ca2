const res = require('express/lib/response');
const { MongoClient, ServerApiVersion } = require('mongodb');
const album = require('./models/album');
const client = new MongoClient(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

var results = [];

exports.findAll = function () {

    var connect = client.connect(err => {
        if (err) throw err;
        const collection = client.db("best-albums").collection("albums");

        collection.find({}).toArray(function (err, res) {
            if (err) throw err;
            //console.log(res);
            results.push(res);
        });

    });
    connect;
    console.log(results);
    return results;
}