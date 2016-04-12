/**
 * Created by Michaël on 12-04-16.
 */

module.exports = function(io){
    io.on('connection', function(socket){
        console.log('A user has connected');
    })
};
