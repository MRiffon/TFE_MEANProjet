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
    
    var allDepartments = function(){
        return $http.get('/api/departments').then(function(response){
            return response;
        });
    };

    var allStatus = function(){
        return $http.get('/api/status').then(function(response){
            return response;
        });
    };
    
    createUser = function(user){
        return $http.post('/api/users', user).then(function(response){
            return response;
        }).catch(function(response){
            return response;
        });
    };
    
    return {
        allUsers : allUsers,
        allDepartments : allDepartments,
        allStatus : allStatus,
        createUser : createUser
    };
}