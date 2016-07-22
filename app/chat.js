/**
 * Created by Michaël and Martin on 12-04-16.
 */

var ChatRoom = require('./models/chatroom');
var Message = require('./models/message');

module.exports = function(io){
    var users = [];
    var usersSocket = [];

    io.on('connection', function(socket){

        //listen for new users
        socket.on('new user', function(data){
            var defaultChat = data.defaultChatRoom;
            socket.join(defaultChat.name);
            io.in(defaultChat.name).emit('user joined default', data);
        });

        socket.on('switch room', function(data){
            socket.leave(data.oldChatRoom);
            socket.join(data.newChatRoom);
            console.log("Change === " + data.newChatRoom);
            io.in(data.oldChatRoom).emit('user has left', data);
            io.in(data.newChatRoom).emit('user has joined', data);
        });

        socket.on('message sended', function(data){
            console.log("Message === " + data.message + " by " + data.sender);
            var msg = new Message({
                created: new Date(),
                sender: data.sender,
                content: data.message,
                chatRoomName: data.room
            });
            msg.save(function(err, msg){
                if(err) {
                    res.send(err);
                } else {
                    console.log("Serveur resend message : " + msg.content + " Dans la room : " + msg.chatRoomName + " by " + msg.sender);
                    io.in(msg.chatRoomName).emit('message dispatched', msg);
                }
            })
        });

        socket.on('requestUsers', function(){
            socket.emit('listUsers', {users: users});
        });

        // Signal nouvel utilisateur connecté
        socket.on('userConnected', function(data){
            usersSocket[data.username] = socket;
            if(users.indexOf(data.username) == -1){
                // envoi signal à tout le monde
                io.emit('userConnected', {username: data.username});
                username = data.username;
                users.push(data.username);
                console.log('Liste des users connectés après connexion : ' + users);
            }
        });

        // Signal d'un utilisateur qui a déconnecté
        socket.on('userDisconnected', function(data){
            console.log(data.username + ' has disconnected');
            users.splice(users.indexOf(data.username), 1);
            console.log('Users après disconnect : ' + users);
            io.emit('userDisconnected', {username: data.username});
        });
        
        // Notif à un certain utilisateur qu'une room le concernant a été créée
        socket.on('notif-newRoom', function(data){
            console.log('notif-newRoom serverside dataRoom : ' + data.name);
            for(var i = 0; i < data.users.length; i++){
                usersSocket[data.users[i]].emit('newRoom', data);
            }
        });
    });
};
