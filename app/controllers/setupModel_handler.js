/**
 * Created by Michael and Martin on 18-07-16.
 */

var mongoose = require('mongoose');
var Status = require('../models/status');
var Role = require('../models/role');
var ChatRoom = require('../models/chatroom');

module.exports = {
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

    setupStatus: function(req, res){
        var status = [{
            name: 'Active'
        }, {
            name: 'Inactive'
        }, {
            name: 'Licenced'
        }, {
            name: 'Developper'
        }];

        for (var i = 0; i < status.length; i++) {
            var newStatus = new Status(status[i]);
            newStatus.save(function(err, savedStatus) {
                if(err)
                    res.send(err);
                console.log(savedStatus);
            });
        }
        res.send('Status initiated !');
    }
};