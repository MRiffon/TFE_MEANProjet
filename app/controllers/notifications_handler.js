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
            Notification.find({ username: req.body.username }).exec(function(err, notifs){
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
        if(!req.payload._id){
            res.status(401).json({message: "Authentication failure !"});
        } else {
            var notif = new Notification();
            
            notif.username = req.body.username;
            notif.identifier = req.body.identifier;
            notif.content = req.body.content;

            notif.save(function(err){
                if (err){
                    res.send(err);
                } else {
                    res.status(200).json({message: 'Created!'});
                }
            });
        }
    }
};