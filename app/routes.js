/**
 * Created by Michaël and Martin on 02-04-16.
 */

var path = require('path');
var userHandler = require('./controllers/users_handler');
var chatRoomHandler = require('./controllers/chatrooms_handler');
var setupHandler = require('./controllers/setupModel_handler');
var rolesHandler = require('./controllers/roles_handler');
var departmentsHandler = require('./controllers/department_handler');
var userStatusHandler = require('./controllers/userStatus_handler');
var ticketStatusHandler = require('./controllers/ticketStatus_handler');
var ticketHandler = require('./controllers/tickets_handler');
var notifHandler = require('./controllers/notifications_handler');
var jwt = require('express-jwt');
var configjwt = require('../config/jwt.js');

// permet de vérifier l'authenication d'un user avant d'utiliser une API, pas utile pour toute
var authentication = jwt({ secret: configjwt.secret, userProperty: 'payload'});

module.exports = function(app, upload, smtpTransport){

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
    .post('/api/resetPwd', authentication, userHandler.resetPassword)
    .put('/api/updateRooms', userHandler.updateChatrooms)
    .get('/api/logout', function(req, res){
        req.logOut();
        res.redirect('/');
    })

    // Api chatrooms
    .post('/api/getMsgs', chatRoomHandler.getMsgs)
    .get('/api/getRooms', chatRoomHandler.getRooms)
    .post('/api/newRoom', chatRoomHandler.newRoom)
    .post('/api/searchRoom', chatRoomHandler.searchRoom)

    // Api setup models mongoose
    .post('/api/setupAdmin', setupHandler.setupAdmin)
    .post('/api/setupChat', setupHandler.setupChatRoom)
    .post('/api/setupRoles', setupHandler.setupRoles)
    .post('/api/setupUserStatus', setupHandler.setupUserStatus)
    .post('/api/setupTicketStatus', setupHandler.setupTicketStatus)
    .post('/api/setupDepartments', setupHandler.setupDepartments)
    .post('/api/setupTickets', setupHandler.setupTickets)
    .post('/api/setupNotifs', setupHandler.setupNotifs)

    // Api roles
    .get('/api/roles', rolesHandler.list)
    .delete('/api/roles/:role_id', rolesHandler.delete)
    .post('/api/roles', rolesHandler.creation)

    // Api departments
    .get('/api/departments', departmentsHandler.list)
    .delete('/api/departments/:department_id', departmentsHandler.delete)
    .post('/api/departments', departmentsHandler.creation)

    // Api status user
    .get('/api/userStatus', userStatusHandler.list)
    .delete('/api/userStatus/:status_id', userStatusHandler.delete)
    .post('/api/userStatus', userStatusHandler.creation)

    // Api status ticket
    .get('/api/ticketStatus', ticketStatusHandler.list)
    .delete('/api/ticketStatus/:status_id', ticketStatusHandler.delete)
    .post('/api/ticketStatus', ticketStatusHandler.creation)

    // Api tickets
    .get('/api/tickets', authentication, ticketHandler.list)
    .post('/api/searchTickets', authentication, ticketHandler.search)
    .delete('/api/tickets/:ticket_id', authentication, ticketHandler.delete)
    .post('/api/tickets', authentication, ticketHandler.creation)
    .put('/api/editTicket', authentication, ticketHandler.edit)
    .get('/api/ticket/:ticket_id', authentication, ticketHandler.get)
    // Api notifications

    .delete('/api/notifs/:notif_id', authentication, notifHandler.delete)
    .post('/api/listNotifs', authentication, notifHandler.list)
    .post('/api/notifs', authentication, notifHandler.creation)
        
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

    .get('/api/sendEmail',function(req, res){
        console.log(req.query);
        var mailOptions={
            to : req.query.to,
            subject : req.query.subject,
            text : req.query.text
        };
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                res.end("error");
            } else {
                res.end("sent");
            }
        })
    })

    .get('*', function(req, res){
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });
};