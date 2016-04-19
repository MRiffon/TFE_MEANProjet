/**
 * Created by Michaël and Martin on 18-04-16.
 */

module.exports = function(grunt){

    grunt.initConfig({

        env: {
            test: {
                NODE_ENV: 'test'
            },

            dev: {
                NODE_ENV: 'development'
            }
        },

        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    watch: ['server.js', 'app/**/*.js', 'app/*.js', 'config/**/*.js', 'config/*.js']
                }
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
            tasks: ['jshint']
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    clearRequireCache: true
                },
                src: ['./app/tests/*.js']
            }
        },

        concurrent: {
            dev: {
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
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('test', ['env:test', 'jshint', 'karma', 'mochaTest']);
    grunt.registerTask('default', ['env:dev', 'jshint', 'concurrent:dev']);
};