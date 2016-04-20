/**
 * Created by Michaël and Martin on 12-04-16.
 */

module.exports = function(io){
    io.on('connection', function(socket){
        console.log('A user has connected');
        socket.on('disconnect', function(){
            console.log('A user has disconnected');
        });
    });
};
