/**
 * Created by Michaël and Martin on 12-04-16.
 */

module.exports = function(io){
    var users = [];

    io.on('connection', function(socket){
        var username = '';
        console.log('A user has connected');

        socket.on('requestUser', function(){
            socket.emit('users', {users: users});
        });

        socket.on('message', function(data){
            io.emit('message', {username: username, message: data.message});
        });

        socket.on('addUser', function(data){
            if(users.indexOf(data.username) == -1){
                io.emit('addUser', {username: data.username});
                username = data.username;
                users.push(data.username);
            }
        });

        socket.on('disconnect', function(){
            console.log(username + ' has disconnected');
            users.splice(users.indexOf(username), 1);
            io.emit('removeUser', {username: username});
        });
    });
};
