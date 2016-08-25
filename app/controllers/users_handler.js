/**
 * Created by Michaël and Martin on 05-04-16.
 */

var mongoose = require('mongoose');
var User = require('../models/user');
var passport = require('passport');
var ChatRoom = require('../models/chatroom');

module.exports = {
    list: function(req, res){
        if(!req.payload._id) {
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
        if(!req.payload._id){
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
            } else if(req.body.type === 'ChatRoom'){
                console.log('ChatRooms search : ' + req.body);
                User.find({ chatRooms: req.body.infosToSearch }).exec(function(err, users){
                    if(err){
                        res.send(err);
                    } else {
                        console.log(users);
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
                if(user.status === 'Active'){
                    token = user.generateJwt();
                    res.status(200).json({
                        token: token,
                        message: 'Authentification réussie !'
                    });
                } else {
                    res.status(401).json({message: "Vous ne possédez plus les droits nécessaires. Veuillez contacter l'administrateur pour plus d'informations."});
                }
            } else {
                res.status(401).json(info);
            }
        })(req, res, next);
    },

    creation: function(req, res){
        var msg;
        if(req.payload.role !== 'Admin') {
            res.status(401).end();
        } else {
            for(var i = 0; i < req.body.length; i++){
                console.log(req.body);
                console.log(i);
                var user = new User();

                user.username = req.body[i].username;
                user.email = req.body[i].email;

                if (req.body[i].password === '') {
                    user.makePassword('password');
                } else {
                    user.makePassword(req.body[i].password);
                }
                
                user.lastname = req.body[i].lastname;
                user.firstname = req.body[i].firstname;

                //user.role = req.body.role;
                user.department = req.body[i].department;

                user.chatRooms = req.body[i].chatRooms;

                user.save(function (err) {
                    if (err){
                        res.status(200).json({message: 'Erreur'});
                    } else {
                        if(i === req.body.length){
                            res.status(200).json({message: 'Created!'});
                        }
                    }
                });
            }
        }
    },

    editProfil: function(req, res){
        if(!req.payload._id){
            res.status(401).end();
        } else {
            var requete = '';
            if(req.payload.role === 'Admin'){
                if(req.body.location === 'profil'){
                    requete = req.payload._id;
                }else{
                    requete = req.body._id;
                }
            } else {
                requete = req.payload._id;
            }
            User.findById(requete).exec(function(err, user){
                if(err){
                    res.send(err);
                } else {
                    console.log(req.body);
                    for(var key in req.body){
                        if(req.body.hasOwnProperty(key)){
                            if(key === "password"){
                                user.makePassword(req.body[key]);
                            }else if(key === 'location'){

                            }
                            else {
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
    },

    updateChatrooms: function(req, res){
        console.log("users_handler : updating users' rooms");
        console.log("action : " + req.body.action);
        User.find({username: {$in: req.body.users}}).exec(function(err, users){
            if(err){
                res.send(err);
            } else {
                for(var i = 0; i < users.length; i++){
                    if(req.body.action === 'add'){
                        users[i].chatRooms.push(req.body.chatRoom);
                    }else if(req.body.action === 'remove'){
                        console.log('remove room : ' + req.body.chatRoom);
                        users[i].chatRooms.splice(users[i].chatRooms.indexOf(req.body.chatRoom), 1);
                    }

                    users[i].save(function(err){
                        if(err){
                            res.send(err);
                        }
                    });
                }
                //Renvoyez un code status ok, évite un pending sur la fonction save() et les 3-4 doublons qui l'accompagnent.
                //Ca reste cependant une solution qui me semble brouillon, à voir si ca pose des problèmes plus tard.
                res.sendStatus(200);
            }
        })
    },

    resetPassword: function(req, res){
        if(!req.payload._id) {
            res.status(401).json({message: "Authentication failure !"});
        } else {
            User.findById(req.payload._id).exec(function(err, user){
                if(!user.checkPassword(req.body.oldPassword)){
                    res.status(200).json({message: 'Mauvais ancien mot de passe !'});
                } else {
                    user.makePassword(req.body.password);

                    user.save(function(err){
                        if(err){
                            res.send(err);
                        } else {
                            res.status(200).json({message: 'Reset !'});
                        }
                    })
                }
            });
        }
    }
};