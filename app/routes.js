/**
 * Created by Michaël on 02-04-16.
 */

var path = require('path');
var User = require('./models/user');
var userHandler = require('./controllers/users_handler');
var jwt = require('express-jwt');
var authentication = jwt({ secret: 'MY_SECRET', userProperty: 'payload'});

module.exports = function(app){

    app.use(function(req, res, next){
        next();
        // todo sécuriser les apis
    })

    .get('/api/users', function(req, res){
        User.find(function(err, users){
            if(err){
                res.send(err);
            }
            res.json(users);
        });
    })
    .delete('/api/user/:user_id',function(req, res){
        User.remove({
            _id: req.params.user_id
        }, function(err, user){
            if(err){
                res.send(err);
            }
            res.json({message: 'Utilisateur bien supprimé !', user: user});
        });
    })
    .get('/api/logout', function(req, res){
        req.logOut();
        res.redirect('/');
    })
    .post('/api/users', userHandler.creation)
    .post('/api/login', userHandler.login)
    .get('/api/profil', authentication, userHandler.profilRead)

    .get('*', function(req, res){
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    });
};
