/**
 * Created by Michael and Martin on 09-06-16.
 */

var mongoose = require('mongoose');
var ChatRoom = require('../models/chatroom');
var Message = require('../models/message');

module.exports = {
    setup: function(req, res){
        var chat = [{
            created: new Date(),
            room: 'Global'
        }, {
            created: new Date(),
            room: 'Administratif'
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

    getMsgs: function(req, res){
        ChatRoom.find({
            'room': req.query.room.toLowerCase()
        }).exec(function(err, msgs){
            res.json(msgs);
        });
    },
    
    getRooms: function(req, res){
        ChatRoom.find(function(err, rooms){
            if(err){
                res.send(err);
            }
            res.json(rooms);
        })
    }
};