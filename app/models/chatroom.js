/**
 * Created by Michael and Martin on 09-06-16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatRoomSchema = new Schema({
    name: String,
    created: Date,
    type: String
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);