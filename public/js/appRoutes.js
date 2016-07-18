/**
 * Created by Michaël and Martin on 04-04-16.
 */

angular.module('appRoutes', []).config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $locationProvider.html5Mode(true);

    $urlRouterProvider
        .when('/dashboard','/dashboard/overview')
        .otherwise('/');

    $stateProvider
        .state('base', {
            "abstract": !0,
            url: '',
            templateUrl: './views/base.html'
        })

        .state('login', {
            url: '/',
            parent: 'base',
            templateUrl: './views/login.html',
            controller: 'loginController'
        })

        .state('dashboard', {
            url: '/dashboard',
            parent: 'base',
            templateUrl: './views/dashboard.html',
            controller: 'dashboardController'
        })

        .state('overview', {
            url: '/overview',
            parent: 'dashboard',
            templateUrl: './views/overview.html',
            controller: 'overviewController'
        })

        .state('profil', {
            url: '/profil',
            parent: 'dashboard',
            templateUrl: './views/profil.html',
            controller: 'profilController'
        })

        .state('calendar', {
            url: '/calendar',
            parent: 'dashboard',
            templateUrl: 'views/calendar.html',
            controller: 'calendarController'
        })

        .state('chatroom', {
            url: '/chatroom',
            parent: 'dashboard',
            templateUrl: './views/chat.html',
            controller: 'chatController'
        })

        .state('administration', {
            url: '/administration',
            parent: 'dashboard',
            templateUrl: './views/administration.html',
            controller: 'adminController'
        });
});