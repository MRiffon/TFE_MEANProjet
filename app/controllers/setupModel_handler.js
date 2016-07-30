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
                console.log(savedChat);
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
                console.log(savedRoles);
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
                console.log(savedStatus);
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
                console.log(savedStatus);
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
                console.log(savedDepartments);
            });
        }
        res.send('Departments initiated !');
    }
};