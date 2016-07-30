/**
 * Created by Michaël and Martin on 30-07-16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ticketStatusSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TicketStatus', ticketStatusSchema);