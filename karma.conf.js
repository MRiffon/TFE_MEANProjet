/**
 * Created by Michaël and Martin on 31-03-16.
 */
module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'public/bower_components/angular/angular.js',
            'public/bower_components/angular-resource/angular-resource.js',
            'public/bower_components/angular-route/angular-route.js',
            'public/bower_components/angular-mocks/angular-mocks.js',
            'public/js/app.js',
            'public//tests/unit/*.js'
        ],
        reporters: ['progress'],
        browsers: ['PhantomJS'],
        captureTimeout: 60000,
        singleRun: true,
        plugins : [
            'karma-jasmine',
            'karma-phantomjs-launcher'
        ]
    });
};