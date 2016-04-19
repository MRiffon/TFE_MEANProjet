/**
 * Created by Michaël on 19-04-16.
 */

var app = require('../../server.js'),
    request = require('supertest'),
    mongoose = require('mongoose'),
    User = require('../models/user');


describe('Users Controller Unit Tests:', function(){

    describe('GET api', function(){
        it('should return the list of the users', function(done){
            request(app)
                .get('/api/users')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200,done);
        });
    });
});