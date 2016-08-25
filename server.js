/**
 * Created by Michaël and Martin on 29-03-16.
 */

// setup l'environnement node par défaut
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Initialisation du framework web Express
var express = require('express');
var app = express();

// Mailing
var email = require('./config/email.js');
var nodemailer = require("nodemailer");

var smtpTransport  = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: email.user,
        pass: email.pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

smtpTransport.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

// Upload de files
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/img/clients/avatar/')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
});

var upload = multer({
    storage: storage
}).single('file');

// Chargement config environnement
var config = require('./config/config.js');

// Initialisation serveur http avec socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);

// cors pour les requêtes interdomaines (pour les fonts par exemple)
var cors = require("cors");
var bodyParser = require("body-parser");

// Setup, configuration et connection à la db MongoDB
var mongoose = require('mongoose');
mongoose.connect(config.db);

// jwt secret config
var configjwt = require('./config/jwt.js');
app.set('secretjwt', configjwt.secret);

var passport = require('passport');

// Middleware aidant dans la validation dans les apis
var validator = require('express-validator');

var favicon = require('serve-favicon');

// module natif à node permettant le résolution de path
var path = require('path');

require('./config/passport');

var port = config.port;

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
require('./app/routes.js')(app, upload, smtpTransport );

// Gestion events socket.io
require('./app/chat.js')(io);

// Exports pour les tests d'api
module.exports = app;

server.listen(port, function(){
    console.log('Le serveur tourne sur le port ' + port);
});