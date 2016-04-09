/**
 * Created by Michaël on 29-03-16.
 */
var express = require('express');
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var db = require('./config/db.js');
var passport = require('passport');
var validator = require('express-validator');

require('./config/passport');

var port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(validator());
app.use(function(err, req, res, next){
    if(err.name === 'UnauthorizedError'){
        res.status(401).json({"message": err.name + ' : ' + err.message});
    }
});

mongoose.connect(db.url);

require('./app/routes.js')(app);

app.listen(port);

console.log('Le serveur tourne sur le port ' + port);