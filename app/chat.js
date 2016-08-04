/**
 * Created by Michaël and Martin on 12-04-16.
 */

var ChatRoom = require('./models/chatroom');
var Message = require('./models/message');

module.exports = function(io){
    var users = [];
    var usersSocket = [];

    var fillInUsersConnectedToNotif = function(usersConcerned, usersConnected){
        var usersToNotif = [];
        console.log('Users connected : ' + usersConnected);
        for(var i = 0; i < usersConcerned.length; i++){
            for(var j = 0; j < usersConnected.length; j++){
                console.log(usersConcerned[i]);
                if(usersConcerned[i] === usersConnected[j]){
                    usersToNotif.push(usersConnected[j]);
                }
            }
        }
        console.log('usersToNotif : ' + usersToNotif);  
        return usersToNotif;
    };

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
                console.log('Liste des sockets : ' + usersSocket.length);
            }
        });

        // Signal d'un utilisateur qui a déconnecté
        socket.on('userDisconnected', function(data){
            console.log(data.username + ' has disconnected');
            users.splice(users.indexOf(data.username), 1);
            usersSocket.splice(users.indexOf(data.username), 1);
            console.log('Users après disconnect : ' + users);
            io.emit('userDisconnected', {username: data.username});
        });
        
        // Notif à un certain utilisateur qu'une room le concernant a été créée
        socket.on('notif-newRoom', function(data){
            console.log('notif-newRoom serverside dataRoom : ' + data.chatRoom);
            var usersToNotif = fillInUsersConnectedToNotif(data.users, users);
            for(var i = 0; i < usersToNotif.length; i++){
                console.log('ca passe vers le emit');
                usersSocket[usersToNotif[i]].emit('newRoom', data);
                usersSocket[usersToNotif[i]].emit('newNotif');
            }
        });
        
        socket.on('notif-newMessage', function(data){
            console.log('notif-newMessage serverside : ' + data.users[0]);
            var usersToNotif = fillInUsersConnectedToNotif(data.users, users);
            for(var i = 0; i < usersToNotif.length; i++){
                console.log(i);
                console.log(usersSocket[0]);
                usersSocket[usersToNotif[i]].emit('newMessage', data);
                usersSocket[usersToNotif[i]].emit('newNotif');
            }
        });
        
        socket.on('notif-ticket', function(data){
            console.log('notif-newTicket serverside : ' + data.users[0]);
            var usersToNotif = fillInUsersConnectedToNotif(data.users, users);
            for(var i = 0; i < usersToNotif.length; i++){
                console.log(i);
                console.log(usersSocket[0]);
                usersSocket[usersToNotif[i]].emit('notifTicket', data);
                usersSocket[usersToNotif[i]].emit('newNotif');
            }
        });
    });
};
