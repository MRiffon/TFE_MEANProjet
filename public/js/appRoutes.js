/**
 * Created by Michaël on 04-04-16.
 */


angular.module('appRoutes', []).config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'loginController'
        })

        .when('/nav', {
            templateUrl: 'views/navigation.html',
            controller: 'navigationController'
        })

        .when('/profil', {
            templateUrl: 'views/profil.html',
            controller: 'profilController'
        })

        .otherwise({redirectTo: '/'});
});