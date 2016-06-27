/**
 * Created by Michaël and Martin on 12-04-16.
 */

var ChatRoom = require('./models/chatroom');
var Message = require('./models/message');

module.exports = function(io){
    var users = [];

    io.on('connection', function(socket){
        var defaultChat = 'Global';
        var rooms = ['Global', 'Administratif'];

        socket.emit('setup', {rooms: rooms});

        socket.on('new user', function(data){
            data.room = defaultChat;
            console.log("ChatRoom : " + data.room);
            socket.join(defaultChat);
            io.in(defaultChat).emit('user has joined', data);
        });

        socket.on('switch room', function(data){
            socket.leave(data.oldChatRoom);
            socket.join(data.newChatRoom);
            console.log("Change === " + data.newChatRoom);
            io.in(data.oldChatRoom).emit('user has left', data);
            io.in(data.newChatRoom).emit('user has joined', data);
        });

        socket.on('message', function(data){
            console.log("ChatRoom === " + data);
            var msg = new Message({
                created: new Date(),
                sender: data.username,
                content: data.message,
                id_chatRoom: data.room._id
            });
            msg.save(function(err, msg){
                if(err)
                    res.send(err);
                io.in(msg.room).emit('message created', msg);
            })
        });

        /*socket.on('requestUsers', function(){
            socket.emit('users', {users: users});
        });

        socket.on('message', function(data){
            io.emit('message', {username: username, message: data.message});
        });

        socket.on('addUser', function(data){
            if(users.indexOf(data.username) == -1){
                io.emit('addUser', {username: data.username});
                console.log('user a ajouter : ' + data.username);
                username = data.username;
                users.push(data.username);
                console.log('users avant delete : ' + users);
            }
        });

        socket.on('disconnect', function(){
            console.log(username + ' has disconnected');
            users.splice(users.indexOf(username), 1);
            console.log('Users après delete : ' + users);
            io.emit('removeUser', {username: username});
        });*/
    });
};
