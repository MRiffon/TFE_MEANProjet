/**
 * Created by Michaël and Martin on 18-04-16.
 */

module.exports = function(grunt){

    grunt.initConfig({

        /*env: {
            test: {
                NODE_ENV: 'test'
            },

            dev: {
                NODE_ENV: 'dev'
            }
        },*/

        nodemon: {
            dev: {
                script: 'server.js'
            }
        },

        jshint: {
            files: ['public/js/**/*.js', 'Gruntfile.js', 'public/js/*.js'],
            options: {
                reporter: require('jshint-stylish')
            }
        },

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint'],
            options: {
                interrupt: true,
                reload: true
            }
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        concurrent: {
            run: {
                options: {
                    logConcurrentOutput: true
                },
                tasks: ['nodemon', 'watch']
            }
        }
    });

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-concurrent');

    grunt.registerTask('test', ['jshint', 'karma']);
    grunt.registerTask('default', ['jshint', 'concurrent:run']);
};