/**
 * Created by Michaël and Martin on 02-04-16.
 */

var path = require('path');
var userHandler = require('./controllers/users_handler');
var chatRoomHandler = require('./controllers/chatrooms_handler');
var setupHandler = require('./controllers/setupModel_handler');
var rolesHandler = require('./controllers/roles_handler');
var jwt = require('express-jwt');
var configjwt = require('../config/jwt.js');
var authentication = jwt({ secret: configjwt.secret, userProperty: 'payload'});

module.exports = function(app){

    // Protection des apis sur base d'un role
    function requireRole(role){
        return function(req, res, next){
            if(req.payload && req.payload.role === role){
                next();
            } else {
                res.send(403);
            }
        }
    }

    app.use(function(req, res, next){
        next();
    })

    // Api user/auth/sess
    .get('/api/users', userHandler.list)
    .delete('/api/users/:user_id',userHandler.delete)
    .post('/api/users', userHandler.creation)
    .post('/api/login', userHandler.login)
    .get('/api/profil', authentication, userHandler.profilRead)
    .get('/api/logout', function(req, res){
        req.logOut();
        res.redirect('/');
    })

    // Api chat
    .post('/api/getMsgs', chatRoomHandler.getMsgs)
    .get('/api/getRooms', chatRoomHandler.getRooms)

    // Api setup models mongoose
    .post('/api/setupChat', setupHandler.setupChatRoom)
    .post('/api/setupRoles', setupHandler.setupRoles)
    .post('/api/setupStatus', setupHandler.setupStatus)

    // Api roles
    .get('/api/roles', rolesHandler.list)
    .delete('/api/roles/:role_id', rolesHandler.delete)
    .post('/api/roles', rolesHandler.creation)

    .get('*', function(req, res){
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });
};
