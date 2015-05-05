module.exports = function ( grunt ) {
	'use strict';
	// Project configuration
	grunt.initConfig({
		// Metadata
		pkg: grunt.file.readJSON('package.json'),

		// Task configuration
		env: {
			options: {
				//Shared Options Hash
			},
			dev: {
				NODE_ENV: 'development',
				DEST: '/'
			},
			build: {
				NODE_ENV: 'production',
				DEST: '/',
				concat: {
					PATH: {
						'value': 'node_modules/.bin',
						'delimiter': ':'
					}
				}
			},
			functions: {
				BY_FUNCTION: function () {
					var value = '123';
					grunt.log.writeln('setting BY_FUNCTION to ' + value);
					return value;
				}
			}
		},
		preprocess: {
			options: {
				inline: true
			},
			js: {
				src: 'src/lib/maptosvg.js',
				dest: 'dist/maptosvg.js'
			}
		},
		concat: {
			options: {},
			dist: {
				src: ['<%= preprocess.js.dest %>'],
				dest: 'dist/maptosvg.js'
			}
		},
		uglify: {
			options: {},
			dist: {
				src: '<%= concat.dist.dest %>',
				dest: 'dist/maptosvg.min.js'
			}
		},
		jshint: {
			options: {
				node: true,
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				unused: true,
				eqnull: true,
				browser: true,
				globals: {jQuery: true},
				boss: true
			},
			gruntfile: {
				src: 'gruntfile.js'
			},
			lib_test: {
				src: ['lib/**/*.js', 'test/**/*.js']
			}
		},
		qunit: {
			files: ['test/**/*.html']
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			lib_test: {
				files: '<%= jshint.lib_test.src %>',
				tasks: ['jshint:lib_test', 'qunit']
			}
		}
	});

	// These plugins provide necessary tasks
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	//grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task
	grunt.registerTask('default', ['preprocess', 'jshint', 'concat', 'uglify']);
	grunt.registerTask('dev', ['env:dev', 'default']);
	grunt.registerTask('build', ['env:build', 'default']);
	//grunt.registerTask('build', ['env:build', 'hint', 'other:build:tasks']);
};

