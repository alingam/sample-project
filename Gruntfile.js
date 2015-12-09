module.exports = function (grunt) {
    var securePort=3000;
    var config = {
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                ignores: ['node_modules/**', 'public/javascripts/lib/**', '**/*.min.js'],
                jshintrc: '.jshintrc'
            }
        },
        uglify: {
          build: {
            files: [{
              expand: true,
              src: '*.js',
              dest:'public/javascripts/custom/min',
              cwd: 'public/javascripts/custom/src',
              ext: '.min.js'
            }]
          }
        },
        less: {
            src: {
                files: [{
                    expand: true,
                    cwd: 'public/stylesheets/less',
                    src: 'styles.less',
                    dest: 'public/stylesheets/css',
                    ext: '.css'
                }]
            }
        },
        cssmin: {
            src: {
                files: [{
                    expand: true,
                    cwd: 'public/stylesheets/css',
                    src: 'styles.css',
                    dest: 'public/stylesheets/css',
                    ext: '.min.css'
                }]
            }
        },
        'node-inspector': {
            options: {
                'save-live-edit': true
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon', 'node-inspector', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug'],
                    env: {
                        PORT: securePort
                    },
                    // omit this property if you aren't serving HTML files and
                    // don't want to open a browser tab on start
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });

                        // opens browser on initial server start
                        nodemon.on('config:update', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('open')('http://localhost:'+securePort);
                            }, 1000);
                        });

                        // refreshes browser when server reboots
                        nodemon.on('restart', function () {
                            // Delay before server listens on port
                            setTimeout(function() {
                                require('fs').writeFileSync('.rebooted', 'rebooted');
                            }, 1000);
                        });
                    }
                }
            }
        },
        watch: {
            all: {
                files: ['public/**/*', 'views/**', '!**/node_modules/**', '!public/javascripts/lib/**/*', '!**/*.min.*'],
                options: {
                    livereload: 3006
                }
            },
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: 'jshint:gruntfile'
            },
            scripts: {
                files: 'public/javascript/**/**/*.js',
                tasks: ['jshint:client', 'uglify']
            },
            server: {
                files: ['.rebooted'],
                options: {
                    livereload: true
                }
            } ,
            less: {
                files: ['public/stylesheets/less/*.less'],
                tasks: ['less', 'cssmin', 'concat:css']
            }
        }
    };

    grunt.initConfig(config);

    // Load the tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.registerTask('default', ['jshint','uglify', 'less', 'cssmin','concurrent']);
};
