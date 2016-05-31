/**
 * Created by Michaël on 20-04-16.
 */

var socket = angular.module('Socket', []);

socket.factory('Socket', ['socketFactory', function(socketFactory){
    return socketFactory();
}]);
