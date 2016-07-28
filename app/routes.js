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

// permet de vérifier l'authenication d'un user avant d'utiliser une API, pas utile pour toute
var authentication = jwt({ secret: configjwt.secret, userProperty: 'payload'});

module.exports = function(app, upload){

    app.use(function(req, res, next){
        next();
        })

    // Api user/auth/sess
    .get('/api/users', authentication, userHandler.list)
    .post('/api/searchUsers', authentication, userHandler.search)
    .delete('/api/users/:user_id', authentication, userHandler.delete)
    .post('/api/users', authentication, userHandler.creation)
    .post('/api/login', userHandler.login)
    .get('/api/profil', authentication, userHandler.readProfil)
    .put('/api/profil', authentication, userHandler.editProfil)
    .get('/api/logout', function(req, res){
        req.logOut();
        res.redirect('/');
    })

    // Api chat
    .post('/api/getMsgs', chatRoomHandler.getMsgs)
    .get('/api/getRooms', chatRoomHandler.getRooms)

    // Api setup models mongoose
    .post('/api/setupAdmin', setupHandler.setupAdmin)
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

    // Api upload de files
    .post('/api/upload', function(req, res){
        upload(req, res, function(err){
            if(err) {
                console.log(err);
                res.json({error_code:1,err_desc:err});
            } else {
                res.json({error_code:0,err_desc:null});
            }
        })
    })

    .get('*', function(req, res){
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });


};