/**
 * Created by Michaël on 04-04-16.
 */


angular.module('appRoutes', []).config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $urlRouterProvider
        .when('/dashboard','/dashboard/profil')
        .otherwise('/');

    $stateProvider
        .state('base', {
            "abstract": !0,
            url: '',
            templateUrl: 'views/base.html'
        })

        .state('login', {
            url: '/',
            parent: 'base',
            templateUrl: 'views/login.html',
            controller: 'loginController'
        })

        .state('dashboard', {
            url: '/dashboard',
            parent: 'base',
            templateUrl: 'views/dashboard.html',
            controller: 'dashboardController'
        })

        .state('profil', {
            url: '/profil',
            parent: 'dashboard',
            templateUrl: 'views/profil.html'
        });
});