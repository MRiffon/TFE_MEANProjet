/**
 * Created by Michael and Martin on 18-07-16.
 */

var mongoose = require('mongoose');
var UserStatus = require('../models/userStatus');
var TicketStatus = require('../models/ticketStatus');
var Role = require('../models/role');
var Department = require('../models/department');
var ChatRoom = require('../models/chatroom');
var User = require('../models/user');
var Ticket = require('../models/ticket');

module.exports = {

    setupAdmin: function(req, res){
        var user = new User({
            username: 'admin',
            email:'admin@gmail.com',
            chatRooms:['Global', 'Administratif'],
            role:'Admin',
            department:'Direction'
        });

        user.makePassword('password');

        user.save(function(err, user){
            if(err){
                res.send(err);
            }
        });
        res.send('Admin initiated !');
    },

    setupChatRoom: function(req, res){
        var chat = [{
            created: new Date(),
            name: 'Global'
        }, {
            created: new Date(),
            name: 'Administratif'
        }];

        for (var i = 0; i < chat.length; i++) {
            var newChat = new ChatRoom(chat[i]);
            newChat.save(function(err, savedChat) {
                if(err)
                    res.send(err);
            });
        }
        res.send('Chatrooms initiated !');
    },
    
    setupRoles: function(req, res){
        var roles = [{
            name: 'Admin'
        }, {
            name: 'User'
        }];

        for (var i = 0; i < roles.length; i++) {
            var newRoles = new Role(roles[i]);
            newRoles.save(function(err, savedRoles) {
                if(err)
                    res.send(err);
            });
        }
        res.send('Roles initiated !');
    },

    setupUserStatus: function(req, res){
        var status = [{
            name: 'Active'
        }, {
            name: 'Inactive'
        }, {
            name: 'Licenced'
        }];

        for (var i = 0; i < status.length; i++) {
            var newStatus = new UserStatus(status[i]);
            newStatus.save(function(err, savedStatus) {
                if(err)
                    res.send(err);
            });
        }
        res.send('User statuses initiated !');
    },

    setupTicketStatus: function(req, res){
        var status = [{
            name: 'Open'
        }, {
            name: 'Closed'
        }, {
            name: 'Pending'
        }, {
            name : 'In Progress'
        }];

        for (var i = 0; i < status.length; i++) {
            var newStatus = new TicketStatus(status[i]);
            newStatus.save(function(err, savedStatus) {
                if(err)
                    res.send(err);
            });
        }
        res.send('Ticket statuses initiated !');
    },

    setupDepartments: function(req, res){
        var departments = [{
            name: 'Support'
        }, {
            name: 'Administratif'
        }, {
            name: 'R&D'
        }, {
            name: 'Direction'
        }];

        for (var i = 0; i < departments.length; i++) {
            var newDepartments = new Department(departments[i]);
            newDepartments.save(function(err, savedDepartments) {
                if(err)
                    res.send(err);
            });
        }
        res.send('Departments initiated !');
    },
    
    setupTickets: function(req, res){
        var tickets = [{
            subject : 'Test1',
            description : 'Une description random',
            priority : 'Low',
            submitter : 'admin',
            client : 'SomeGuy',
            assigned : 'testyolo',
            department : 'Support',
            deadline : new Date(),
            updated : new Date(),
            lastUpdateBy : 'admin',
            comments : ['Une premier commentaire random', 'Un autre pour la route !']
        }, {
            subject : 'Test2',
            description : 'Une autre description random',
            priority : 'Medium',
            submitter : 'testyolo',
            client : 'ThisGuy',
            assigned : 'admin',
            department : 'Direction',
            deadline : new Date(),
            updated : new Date(),
            lastUpdateBy : 'testyolo',
        }, {
            subject : 'Test3',
            description : 'Une certaine description de ouf',
            priority : 'High',
            submitter : 'bolosse',
            client : 'ThatGuy',
            status : 'Closed',
            assigned : 'testyolo',
            department : 'Support',
            deadline : new Date(),
            updated : new Date(),
            lastUpdateBy : 'bolosse',
        }, {
            subject : 'Test4 assez long pour tout décaler',
            description : 'Une autre certaine description de ouf',
            priority : 'High',
            submitter : 'testyolo',
            client : 'ThatGuy',
            assigned : 'bolosse',
            department : 'R&D',
            deadline : new Date(),
            updated : new Date(),
            lastUpdateBy : 'testyolo',
        }];

        for (var i = 0; i < tickets.length; i++) {
            var newTicket = new Ticket(tickets[i]);
            newTicket.save(function(err, savedTicket) {
                if(err)
                    res.send(err);
            });
        }
        res.send('Tickets initiated !');
    }
};