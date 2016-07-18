/**
 * Created by Michaël and Martin on 05-04-16.
 */

var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var configjwt = require('../../config/jwt.js');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Active",
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "User"
    },
    hash: String,
    salt: String,
    chatRooms: [String]
});

userSchema.methods.makePassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.checkPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return (this.hash === hash);
};

userSchema.methods.generateJwt = function(){
    var expire = new Date();
    expire.setDate(expire.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        chatRooms: this.chatRooms,
        role: this.role,
        expire: parseInt(expire.getTime() / 1000),
      }, configjwt.secret);
};

module.exports = mongoose.model('User', userSchema);