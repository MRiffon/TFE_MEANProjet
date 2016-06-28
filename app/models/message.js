/**
 * Created by micka and Martin on 27-06-16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    created: Date,
    content: String,
    sender: String,
    chatRoomName: String
});

module.exports = mongoose.model('message', messageSchema);