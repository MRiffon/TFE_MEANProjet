/**
 * Created by Michaël and Martin on 18-07-16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userStatusSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UserStatus', userStatusSchema);