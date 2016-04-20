/**
 * Created by Michaël and Martin on 30-03-16.
 */
angular.module('app', [
        'ui.router',
        'ngAnimate',
        'btford.socket-io',
        'appRoutes',
        'appRun',
        'dataFetching',
        'authentication',
        'Socket',
        'loginCtrl',
        'profilCtrl',
        'dashboardCtrl',
        'overviewCtrl',
        'chatCtrl']
);