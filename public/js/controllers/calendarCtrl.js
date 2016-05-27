/**
 * Created by Martouf on 26-05-16.
 */

angular.module('calendarCtrl', []).controller('calendarController', function($scope, $location, $http){
    $scope.currentDate = new Date();
});