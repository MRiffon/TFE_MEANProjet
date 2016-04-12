/**
 * Created by Michaël on 05-04-16.
 */

var mongoose = require('mongoose');
var User = require('../models/user');
var passport = require('passport');

module.exports = {
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

            user.save(function(err){
                if (err){
                    res.send(err);
                }
                res.json(user);
            });
        }
    },

    profilRead: function(req, res){
        if(!req.payload._id){
            res.status(401).json({"message": "Vous ne pouvez pas accéder à ce profil."});
        } else {
            User.findById(req.payload._id).exec(function(err, user){
                res.status(200).json(user);
            });
        }
    }
};