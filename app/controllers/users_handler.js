/**
 * Created by Michaël and Martin on 05-04-16.
 */

var mongoose = require('mongoose');
var User = require('../models/user');
var passport = require('passport');
var ChatRoom = require('../models/chatroom');

module.exports = {
    list: function(req, res){
        User.find(function(err, users){
            if(err){
                res.send(err);
            }
            res.json(users);
        });
    },

    delete: function(req, res){
        User.remove({
            _id: req.params.user_id
        }, function(err, user){
            if(err)
                res.send(err);
            res.json({message: 'Supprimé !', user: user});
        });
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
        var user = new User();

        req.checkBody("username", "Nom utilisateur invalide").notEmpty();
        req.checkBody("email", "Email invalide").notEmpty().isEmail();
        req.checkBody("password", "Password invalide").notEmpty().len(8,30);

        var errors = req.validationErrors();
        if(errors){
            res.send(errors);
        } else {
            user.username = req.body.username;
            user.email = req.body.email;

            user.makePassword(req.body.password);

            user.chatRooms[0] = req.body.chatRooms[0];

            user.save(function(err){
                if (err){
                    res.send(err);
                } else {
                    res.json(user);
                }
            });
        }
    },

    editProfil: function(req, res){
        if(!req.payload._id){
            res.status(401).json({message: "Authentication failure !"});
        } else {
            User.findById(req.payload._id).exec(function(err, user){
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

    readProfil: function(req, res){
        if(!req.payload._id){
            res.status(401).json({message: "Authentication failure !"});
        } else {
            User.findById(req.payload._id).exec(function(err, user){
                res.status(200).json(user);
            });
        }
    }
};