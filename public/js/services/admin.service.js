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

    var searchedUsers = function(infos){
        return $http.post('/api/searchUsers', infos, {
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
        return $http.get('/api/userStatus').then(function(response){
            return response;
        });
    };
    
    createUser = function(users){
        console.log(users);
        return $http.post('/api/users', users, {
            headers: {
                Authorization: 'Bearer ' + log.getToken()
            }
        }).then(function(response){
            return response;
        }).catch(function(response){
            return response;
        });
    };

    deleteUser = function(user){
        return $http.delete('/api/users/'+user._id, {
            headers: {
                Authorization: 'Bearer ' + log.getToken()
            }
        }).then(function(response){
            return response;
        }).catch(function(response){
            return response;
        });
    };

    updateUser = function(user){
        return $http.put('/api/profil', user, {
            headers: {
                Authorization: 'Bearer ' + log.getToken()
            }
        }).then(function(response){
            return response;
        });
    };
    
    return {
        allUsers : allUsers,
        searchedUsers : searchedUsers,
        allDepartments : allDepartments,
        allStatus : allStatus,
        createUser : createUser,
        deleteUser : deleteUser,
        updateUser : updateUser
    };
}