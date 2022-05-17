const express = require("express"),
    bodyParser = require("body-parser"),
    http = require("http"),
    path = require("path"),
    logger = require("morgan"),
    mongoose = require("mongoose"),
    dotenv = require("dotenv"),
    cors = require('cors');

let app = express(),
    server = http.createServer(app);

dotenv.config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require('./routes'));
app.use(logger("tiny"));

mongoose.connect(process.env.dbURI);

mongoose.connection.on('error', (err) => {
    console.log('Mongodb error ', err, '.');
    process.exit();
});
mongoose.connection.on('connected', () => {
    console.log('MongoDB successfully connected.');
});

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'albums/build')));
  // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'albums/build', 'index.html'));
    });
  }

server.listen(
    //process.env.PORT || 8000,
    8000,
    process.env.IP || "0.0.0.0",
    function () {
        const addr = server.address();
        console.log("Server listening at", addr.address + ":" + addr.port);
    }
);