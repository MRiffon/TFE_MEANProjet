/**
 * Created by Michaël on 19-04-16.
 */

var app = require('../../server.js'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    should = require('chai').should(),
    expect = require('chai').expect,
    User = require('../models/user');

var log_user = {
    email: 'test@test.com',
    password: 'password'
};

var nolog_user = {
    email: 'test@test.com',
    password: 'badpassword'
};

describe('Users Non Authenticated requests:', function(){

    beforeEach(function(done){
        user = new User({
            username: 'test',
            email: 'test@test.com'
        });

        user.makePassword('password');
        user.save(function(err){
            if(err) throw err;
            done();
        });
    });

    it('should return the users and status 200', function(done){
        request(app)
            .get('/api/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                res.body.should.be.an.Array;
                expect(res.body[0]).to.have.property('username');
                expect(res.body[0].username).to.not.equal(null);
                expect(res.body[0]).to.have.property('email');
                expect(res.body[0].email).to.not.equal(null);
                expect(res.body[0]).to.have.property('salt');
                expect(res.body[0].salt).to.not.equal(null);
                expect(res.body[0]).to.have.property('hash');
                expect(res.body[0].hash).to.not.equal(null);
                done();
            });
    });

    it('should delete an existing user and return status 200', function(done){
        request(app)
            .delete('/api/user/' + user.id)
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                res.status.should.equal(200);
                res.body.message.should.equal('Supprimé !');
                res.body.user.ok.should.equal(1);
                done();
            });
    });

    it('should login the user and return status 200', function(done){

        request(app)
            .post('/api/login')
            .send(log_user)
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                res.status.should.equal(200);
                res.body.token.should.not.equal(null);
                res.body.message.should.equal('Authentification réussie !');
                done();
            });
    });

    it('should not login the user and return status 401 Unauthorized', function(done){

        request(app)
            .post('/api/login')
            .send(nolog_user)
            .expect(401)
            .end(function(err, res){
                if(err) return done(err);
                res.status.should.equal(401);
                done();
            });
    });

    afterEach(function(done){
        User.remove().exec();
        done();
    });
});