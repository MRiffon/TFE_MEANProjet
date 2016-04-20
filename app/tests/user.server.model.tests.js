/**
 * Created by Michaël and Martin on 19-04-16.
 */

var app = require('../../server.js'),
    mongoose = require('mongoose'),
    User = require('../models/user');

var user;

describe('User Model :', function(){

    describe('User Model Fields Tests', function(){
        beforeEach(function(){
            user = new User({
                email: 'test@gmail.com',
                username: 'test'
            });
        });

        describe('#save', function(){
            it('should save the user without error', function(done){
                user.save(function(err){
                    if(err) throw err;
                    done();
                })
            });
            it('should not save the user without an email', function(done){
                user.email = '';
                user.save(function(err){
                    if(err) done();
                });
            });
            it('should not save the user without a username', function(done){
                user.username = '';
                user.save(function(err){
                    if(err) done();
                });
            });
        });

        afterEach(function(done){
            User.remove(function(){
                done();
            });
        });
    });

    describe('User Model Methods Tests:', function(){
        before(function(){
            user = new User({
                email: 'test@gmail.com',
                username: 'test'
            });
            password = 'password';
        });

        describe('#Password', function(){
            it('should created hash and salt based on password', function(){
                user.makePassword(password, function(err, infoUser){
                    if(infoUser.hash == null || infoUser.salt == null) throw err;
                });
            });
            it('should check the password', function(){
                user.checkPassword(password, function(err, bool){
                    if(bool) throw err;
                })
            })
        });
        after(function(done){
            User.remove(function(){
                done();
            });
        });
    });
});
