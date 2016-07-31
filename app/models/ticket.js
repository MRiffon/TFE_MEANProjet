/**
 * Created by Michaël and Martin on 30-07-16.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ticketSchema = new Schema({
    subject : {
        type : String,
        required : true
    },
    description: {
        type : String
    },
    comments : [String],
    priority : {
        type : String,
        required : true
    },
    submitter : {
        type : String,
        required : true
    },
    client : {
        type : String,
        required : true
    },
    status : {
        type : String,
        default: "Open",
        required : true
    },
    department : {
        type : String,
        required : true
    },
    assigned : {
        type : String,
        required : true
    },
    deadline : {
        type : Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type : Date,
        required : true
    },
    lastUpdateBy : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model('Ticket', ticketSchema);