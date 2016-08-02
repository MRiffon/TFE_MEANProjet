/**
 * Created by Michaël and Martin on 25-07-16.
 */

var mongoose = require('mongoose');
var UserStatus = require('../models/userStatus');

module.exports = {
    list: function(req, res){
        UserStatus.find(function(err, status){
            if(err){
                res.send(err);
            }
            res.json(status);
        });
    },

    delete: function(req, res){
        UserStatus.remove({
            _id: req.params.role_id
        }, function(err, status){
            if(err)
                res.send(err);
            res.json({message: 'Supprimé !', status: status});
        });
    },

    creation: function(req, res){
        var status = new UserStatus();

        status.name = req.body.name;

        status.save(function(err){
            if (err){
                res.send(err);
            } else {
                res.json(status);
            }
        });
    }
};