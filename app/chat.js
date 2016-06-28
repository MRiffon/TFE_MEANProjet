/**
 * Created by Michaël and Martin on 12-04-16.
 */

var ChatRoom = require('./models/chatroom');
var Message = require('./models/message');

module.exports = function(io){
    var users = [];

    io.on('connection', function(socket){
        var defaultChat = 'Global';

        //socket.emit('setup', {rooms: rooms});

        //listen for new users
        socket.on('new user', function(data){
            data.name = defaultChat;
            console.log("ChatRoom : " + data);
            socket.join(defaultChat);
            io.in(defaultChat).emit('user has joined', data);
        });

        socket.on('switch name', function(data){
            socket.leave(data.oldChatRoom);
            socket.join(data.newChatRoom);
            console.log("Change === " + data.newChatRoom);
            io.in(data.oldChatRoom).emit('user has left', data);
            io.in(data.newChatRoom).emit('user has joined', data);
        });

        socket.on('message', function(data){
            console.log("Message === " + data.message);
            var msg = new Message({
                created: new Date(),
                sender: data.username,
                content: data.message,
                chatRoomName: data.room
            });
            msg.save(function(err, msg){
                if(err) {
                    res.send(err);
                } else {
                    io.in(msg.id_chatRoom).emit('message sended', msg);
                }
            })
        });


        /*socket.on('requestUsers', function(){
            socket.emit('users', {users: users});
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
