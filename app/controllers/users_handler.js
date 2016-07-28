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

            user.chatRooms = req.body.chatRooms;

            user.save(function(err){
                if (err){
                    res.send(err);
                } else {
                    res.json(user);
                }
            });
        }
    },

    profilRead: function(req, res){
        if(!req.payload._id){
            res.status(401);
        } else {
            User.findById(req.payload._id).exec(function(err, user){
                res.status(200).json(user);
            });
        }
    },

    updateChatrooms: function(req, res){
        console.log("users_handler : updating users' rooms");
        User.find({username: {$in: req.body.users}}).exec(function(err, users){
            if(err){
                res.send(err);
            } else {
                for(var i = 0; i < users.length; i++){
                    users[i].chatRooms.push(req.body.chatRoom);
                    users[i].save(function(err){
                        if(err){
                            res.send(err);
                        }
                    });
                }
                //Renvoyez un code status ok, évite un pending sur la fonction save() et les 3-4 doublons qui l'accompagnent.
                //Ca reste cependant une solution qui me semble brouillon, à voir si ca pose des problèmes plus tard.
                res.send(200);
            }
        })
    }
};