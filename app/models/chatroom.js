/**
 * Created by Michael and Martin on 09-06-16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatRoomSchema = new Schema({
    room: String,
    created: Date
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);