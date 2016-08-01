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
                res.status(200).json(tickets);
            })
        }
    },

    search: function(req, res){
        if(!req.payload._id){
            res.status(401).json({message: "Authentication failure !"});
        } else {
            if(req.body.type === 'ownTickets'){
                Ticket.find({$or : [{submitter : req.body.infosToSearch}, {assigned : req.body.infosToSearch}]}).exec(function(err, tickets){
                    if(err){
                        res.send(err);
                    } else {
                        res.status(200).json(tickets);
                    }
                })
            } else if(req.body.type === 'Department'){
                Ticket.find({ department: req.body.infosToSearch }).exec(function(err, tickets){
                    if(err){
                        res.send(err);
                    } else {
                        res.status(200).json(tickets);
                    }
                })
            } else if(req.body.type === 'Priority'){
                Ticket.find({ priority: req.body.infosToSearch }).exec(function(err, tickets){
                    if(err){
                        res.send(err);
                    } else {
                        res.status(200).json(tickets);
                    }
                })
            } else if(req.body.type === 'Status'){
                Ticket.find({ status: req.body.infosToSearch }).exec(function(err, tickets){
                    if(err){
                        res.send(err);
                    } else {
                        res.status(200).json(tickets);
                    }
                })
            } else {
                Ticket.find({ subject: {'$regex': req.body.infosToSearch} }).exec(function(err, tickets){
                    if(err){
                        res.send(err);
                    } else {
                        res.status(200).json(tickets);
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
            ticket.description = req.body.description;
            ticket.priority = req.body.priority;
            ticket.submitter = req.body.submitter;
            ticket.client = req.body.client;
            ticket.status = req.body.status;
            ticket.department = req.body.department;
            ticket.assigned = req.body.assigned;
            ticket.deadline = req.body.deadline;
            ticket.updated = new Date();
            ticket.lastUpdateBy = req.body.lastUpdateBy;

            ticket.save(function(err){
                if (err){
                    res.send(err);
                } else {
                    res.status(200).json({message: 'Created!'});
                }
            });
        }
    },

    edit: function(req, res){
        console.log(req.body);
        if(!req.payload._id){
            res.status(401).json({message: "Authentication failure !"});
        } else {
            Ticket.findById(req.body._id).exec(function(err, ticket){
                if(err){
                    res.send(err);
                } else {
                    for(var key in req.body){
                        if(req.body.hasOwnProperty(key)){
                            if(key === 'updated') {
                                ticket[key] = new Date();
                            } else if(key === 'comment'){
                                ticket.comments.push(req.body[key]);
                            } else ticket[key] = req.body[key];
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
