/**
 * Created by Michaël and Martin on 29-03-16.
 * Created by Michaël and Martin on 29-03-16. chat
 */

// Initialisation du framework web Express
var express = require('express');
var app = express();

// Initialisation serveur http avec socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

// cors pour les requêtes interdomaines (pour les fonts par exemple)
var cors = require("cors");
var bodyParser = require("body-parser");

// Setup, configuration et connection à la db MongoDB
var mongoose = require('mongoose');
var db = require('./config/db.js');
mongoose.connect(db.url);

// jwt secret config
var configjwt = require('./config/jwt.js');
app.set('secretjwt', configjwt.secret)

var passport = require('passport');

// Middleware aidant dans la validation dans les apis
var validator = require('express-validator');

var favicon = require('serve-favicon');

// module natif à node permettant le résolution de path
var path = require('path');

require('./config/passport');

var port = process.env.PORT || 3000;

// setup l'envirronnement node par défaut
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());
app.use(validator());
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(function(err, req, res, next){
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({"message": err.name + ' : ' + err.message});
    }
});

// Gestion des routes/apis
require('./app/routes.js')(app);

// Gestion events socket.io
require('./app/chat.js')(io);

http.listen(port);
console.log('Le serveur tourne sur le port ' + port);