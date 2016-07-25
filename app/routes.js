/**
 * Created by Michaël and Martin on 02-04-16.
 */

var path = require('path');
var userHandler = require('./controllers/users_handler');
var chatRoomHandler = require('./controllers/chatrooms_handler');
var setupHandler = require('./controllers/setupModel_handler');
var rolesHandler = require('./controllers/roles_handler');
var departmentsHandler = require('./controllers/department_handler');
var statusHandler = require('./controllers/status_handler');
var jwt = require('express-jwt');
var configjwt = require('../config/jwt.js');
var authentication = jwt({ secret: configjwt.secret, userProperty: 'payload'});

module.exports = function(app){
    
    app.use(function(req, res, next){
        next();
    })

    // Api user/auth/sess
    .get('/api/users', authentication, userHandler.list)
    .delete('/api/users/:user_id',userHandler.delete)
    .post('/api/users', userHandler.creation)
    .post('/api/login', userHandler.login)
    .get('/api/profil', authentication, userHandler.profilRead)
    .put('/api/profil', authentication, userHandler.editProfil)
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
    .post('/api/setupDepartments', setupHandler.setupDepartments)

    // Api roles
    .get('/api/roles', rolesHandler.list)
    .delete('/api/roles/:role_id', rolesHandler.delete)
    .post('/api/roles', rolesHandler.creation)
        
    // Api departments
    .get('/api/departments', departmentsHandler.list)
    .delete('/api/departments/:department_id', departmentsHandler.delete)
    .post('/api/departments', departmentsHandler.creation)

    // Api status
    .get('/api/status', statusHandler.list)
    .delete('/api/status/:status_id', statusHandler.delete)
    .post('/api/status', statusHandler.creation)

    .get('*', function(req, res){
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });
};
