/**
 * Created by Michaël on 20-04-16.
 */

angular.module('chatCtrl', []).controller('chatController', function($scope, Socket){
    Socket.connect();

    $scope.$on('$locationChangeStart', function(event){
        Socket.disconnect(true);
    });
});
