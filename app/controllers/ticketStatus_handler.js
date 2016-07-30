/**
 * Created by Michaël and Martin on 30-07-16.
 */

var mongoose = require('mongoose');
var TicketStatus = require('../models/ticketStatus');

module.exports = {
    list: function(req, res){
        TicketStatus.find(function(err, status){
            if(err){
                res.send(err);
            }
            res.json(status);
        });
    },

    delete: function(req, res){
        TicketStatus.remove({
            _id: req.params.role_id
        }, function(err, status){
            if(err)
                res.send(err);
            res.json({message: 'Supprimé !', status: status});
        });
    },

    creation: function(req, res){
        var status = new TicketStatus();

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