/**
 * Created by micka on 18-07-16.
 */

var admin = angular.module('adminData', []);

admin.factory('adminData', adminData);

adminData.$inject = ['$http', 'userData'];

function adminData($http, log){
    
    var allUsers = function(){
        return $http.get('/api/users', {
            headers: {
                Authorization: 'Bearer ' + log.getToken()
            }
        }).then(function(response){
            return response;
        });
    };
    
    return {
        allUsers : allUsers
    };
}