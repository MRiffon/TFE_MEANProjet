/**
 * Created by Michaël and Martin on 25-07-16.
 */

var mongoose = require('mongoose');
var Status = require('../models/status');

module.exports = {
    list: function(req, res){
        Status.find(function(err, status){
            if(err){
                res.send(err);
            }
            res.json(status);
        });
    },

    delete: function(req, res){
        Status.remove({
            _id: req.params.role_id
        }, function(err, status){
            if(err)
                res.send(err);
            res.json({message: 'Supprimé !', status: status});
        });
    },

    creation: function(req, res){
        var status = new Status();

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