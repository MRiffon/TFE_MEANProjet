/**
 * Created by Michaël and Martin on 30-07-16.
 */

var mongoose = require('mongoose');
var Ticket = require('../models/ticket');

module.exports = {
    list: function(req, res){
        if(!req.payload._id){
            res.status(401).json({message: "Authentication failure !"});
        } else {
            Ticket.find(function(err, tickets){
                if(err)
                    res.send(err);
                res.send(200).json(tickets);
            })
        }
    },

    search: function(req, res){
        if(req.payload.role !== 'Admin'){
            res.status(401).end();
        } else {
            if(req.body.type === 'Status'){
                User.find({ status: req.body.infosToSearch }).exec(function(err, users){
                    if(err){
                        res.send(err);
                    } else {
                        res.status(200).json(users);
                    }
                })
            } else if(req.body.type === 'Department'){
                User.find({ department: req.body.infosToSearch }).exec(function(err, users){
                    if(err){
                        res.send(err);
                    } else {
                        res.status(200).json(users);
                    }
                })
            } else {
                User.find({ username: req.body.infosToSearch }).exec(function(err, user){
                    if(err) {
                        res.send(err);
                    } else {
                        res.status(200).json(user);
                    }
                })
            }
        }
    },

    delete: function(req, res){
        if(!req.payload._id){
            res.status(401).json({message: "Authentication failure !"});
        } else {
            Ticket.remove({
                _id: req.params.ticket_id
            }, function(err, ticket){
                if(err)
                    res.send(err);
                res.json({message: 'Supprimé !', ticket: ticket});
            });
        }
    },

    creation: function(req, res){
        if(!req.payload._id){
            res.status(401).json({message: "Authentication failure !"});
        } else {
            var ticket = new Ticket();

            ticket.subject = req.body.subject;
            ticket.priority = req.body.priority;
            ticket.submitter = req.body.submitter;
            ticket.client = req.body.client;
            ticket.status = req.body.status;
            ticket.department = req.body.department;
            ticket.assigned = req.body.assigned;
            ticket.dueBye = req.body.dueBye;

            ticket.save(function(err){
                if (err){
                    res.send(err);
                } else {
                    res.json(ticket);
                }
            });
        }
    },

    edit: function(req, res){
        if(!req.payload._id){
            res.status(401).json({message: "Authentication failure !"});
        } else {
            Ticket.findById(req.body._id).exec(function(err, ticket){
                if(err){
                    res.send(err);
                } else {
                    for(var key in req.body){
                        if(req.body.hasOwnProperty(key)){
                            ticket[key] = req.body[key];
                        }
                    }
                    ticket.save(function(err){
                        if(err) {
                            console.log(err);
                            res.send(err);
                        } else {
                            res.status(200).json({message: 'Updated!'});
                        }
                    });
                }
            })
        }
    }
};
