/**
 * Created by Michael and Martin on 09-06-16.
 */

var mongoose = require('mongoose');
var ChatRoom = require('../models/chatroom');
var Message = require('../models/message');

module.exports = {
    getMsgs: function(req, res){
        console.log("log req : " + req);
        Message.find({
            'chatRoomName': req.body.name
        }).sort({created:1}).exec(function(err, msgs){
            res.json(msgs);
        });
    },
    
    getRooms: function(req, res){
        ChatRoom.find(function(err, rooms){
            if(err){
                res.send(err);
            } else {
                res.json(rooms);
            }
        })
    },

    newRoom: function(req, res){
        var newRoom = new ChatRoom();

        newRoom.name = req.body.name;
        newRoom.type = req.body.type;
        newRoom.created = new Date();

        newRoom.save(function(err){
            if(err)
                res.send(err);
            res.json(newRoom);
        });
    },
    
    searchRoom: function(req, res){
        console.log(req.body.chatroom);
        ChatRoom.find({ name: req.body.chatroom }).exec(function(err, chatroom){
            if(err){
                res.send(err);
            } else {
                res.status(200).json(chatroom);
            }
        })
    }
};