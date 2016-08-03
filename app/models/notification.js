/**
 * Created by Michaël and Martin on 02-08-16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notificationSchema = new Schema({
    username: {
        type : String,
        required : true
    },
    identifier : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    isRead : {
        type : Boolean,
        required : true,
        default : false
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);