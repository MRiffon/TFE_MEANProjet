/**
 * Created by Michaël and Martin on 05-04-16.
 */

var mongoose = require('mongoose');
var User = require('../models/user');
var passport = require('passport');

module.exports = {
    list: function(req, res){
        if(req.payload.role !== 'Admin') {
            res.redirect('/');
            res.status(401).end();
        } else {
            User.find(function(err, users){
                if(err){
                    res.send(err);
                }
                res.json(users);
            });
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
        if(req.payload.role !== 'Admin'){
            res.status(401).end();
        } else {
            User.remove({
                _id: req.params.user_id
            }, function(err, user){
                if(err)
                    res.send(err);
                res.json({message: 'Supprimé !', user: user});
            });
        }
    },

    login: function(req, res, next){
        passport.authenticate('local', function(err, user, info){
            var token;

            if(err){
                res.send(err);
            }

            if(user) {
                token = user.generateJwt();
                res.status(200).json({
                    token: token,
                    message: 'Authentification réussie !'
                });
            } else {
                res.status(401).json(info);
            }
        })(req, res, next);
    },

    creation: function(req, res){
        var error = '';
        if(req.payload.role !== 'Admin') {
            res.status(401).end();
        } else {
            console.log(req.body);
            for(var i = 0; i < req.body.length; i++){

                var user = new User();

                user.username = req.body[i].username;
                user.email = req.body[i].email;

                if (req.body[i].password === '') {
                    user.makePassword('password');
                } else {
                    user.makePassword(req.body[i].password);
                }

                //user.role = req.body.role;
                user.department = req.body[i].department;

                user.chatRooms[0] = req.body[i].chatRooms[0];

                user.save(function (err) {
                    if (err){
                        res.send(err);
                    } else {
                        error = false;
                    }
                });
            }
            if(!error){
                console.log('Pas derreur');
                res.status(200).json({message: 'Created!'});
            }
        }
    },

    editProfil: function(req, res){
        if(!req.payload._id){
            res.status(401).end();
        } else {
            var requete = '';
            if(req.payload.role === 'Admin'){
                requete = req.body._id;
            } else {
                requete = req.payload._id;
            }
            User.findById(requete).exec(function(err, user){
                if(err){
                    res.send(err);
                } else {
                    for(var key in req.body){
                        if(req.body.hasOwnProperty(key)){
                            if(key === "password"){
                                user.makePassword(req.body[key]);
                            } else {
                                user[key] = req.body[key];
                            }
                        }
                    }
                    user.save(function(err){
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
    },

    profilRead: function(req, res){
        if(!req.payload._id){
            res.status(401).end();
        } else {
            User.findById(req.payload._id).exec(function(err, user){
                res.status(200).json(user);
            });
        }
    }
};