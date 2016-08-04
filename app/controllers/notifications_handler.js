/**
 * Created by Michaël and Martin on 02-08-16.
 */

var mongoose = require('mongoose');
var Notification = require('../models/notification');

module.exports = {
    list: function(req, res){
        if(!req.payload._id){
            res.status(401).json({message: "Authentication failure !"});
        } else {
            Notification.find({ username: req.body.username }).sort({created:-1}).exec(function(err, notifs){
                if(err){
                    res.send(err);
                } else {
                    res.status(200).json(notifs);
                }
            })
        }
    },
    
    delete: function(req, res){
        if(!req.payload._id){
            res.status(401).json({message: "Authentication failure !"});
        } else {
            Notification.remove({
                _id: req.params.notif_id
            }, function(err, notif){
                if(err)
                    res.send(err);
                res.json({message: 'Supprimé !', notif: notif});
            });
        }
    },

    creation: function(req, res){
        var error = '';
        if(!req.payload._id){
            res.status(401).json({message: "Authentication failure !"});
        } else {
            for(var i = 0; i < req.body.users.length; i++){

                var notif = new Notification();

                if(req.body.identifier === 'Ticketting'){
                    notif.username = req.body.users[i];
                } else {
                    notif.username = req.body.users[i].username;
                }

                notif.identifier = req.body.identifier;
                notif.content = req.body.content;

                notif.save(function(err){
                    if (err){
                        res.send(err);
                    } else {
                        error = false;
                    }
                });
            }
            if(!error){
                res.status(200).json({message: 'Created!'});
            }
        }
    }
};