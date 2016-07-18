/**
 * Created by Michaël and Martin on 18-07-16.
 */

var mongoose = require('mongoose');
var Role = require('../models/role');

module.exports = {
    list: function(req, res){
        Role.find(function(err, roles){
            if(err){
                res.send(err);
            }
            res.json(roles);
        });
    },

    delete: function(req, res){
        Role.remove({
            _id: req.params.role_id
        }, function(err, role){
            if(err)
                res.send(err);
            res.json({message: 'Supprimé !', role: role});
        });
    },

    creation: function(req, res){
        var role = new Role();

        role.name = req.body.name;

        role.save(function(err){
            if (err){
                res.send(err);
            } else {
                res.json(role);
            }
        });
    }
};