/**
 * Created by Michaël and Martin on 02-04-16.
 */

var path = require('path');
var userHandler = require('./controllers/users_handler');
var chatRoomHandler = require('./controllers/chatrooms_handler');
var jwt = require('express-jwt');
var configjwt = require('../config/jwt.js');
var authentication = jwt({ secret: configjwt.secret, userProperty: 'payload'});

module.exports = function(app){

    app.use(function(req, res, next){
        next();
        // todo sécuriser les api
    })

    // Api user/auth/sess
    .get('/api/users', userHandler.list)
    .delete('/api/user/:user_id',userHandler.delete)
    .post('/api/users', userHandler.creation)
    .post('/api/login', userHandler.login)
    .get('/api/profil', authentication, userHandler.profilRead)
    .get('/api/logout', function(req, res){
        req.logOut();
        res.redirect('/');
    })
    .post('/api/setupChat', chatRoomHandler.setup)
    .get('/api/getMsgs', chatRoomHandler.getMsgs)

    .get('*', function(req, res){
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });
};
