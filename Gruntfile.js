module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON( 'package.json' ),

		watch: {
			js: {
				files: [ 'src/**/*.js'],
				tasks: [ 'clean:tmp', 'requirejs' ],
				options: {
					interrupt: true,
					force: true
				}
			}
		},

		requirejs: {
			full: {
				options: {
					out: 'tmp/Library.js'
				}
			},
			options: {
				baseUrl: 'src/',
				name: 'Library',
				optimize: 'none',
				logLevel: 2,
				onBuildWrite: function( name, path, contents ) {
					return require( 'amdclean' ).clean( contents ) + '\n';
				}
			}
		},

		clean: {
			tmp: [ 'tmp/' ],
			build: [ 'build/' ]
		},

		jshint: {
			files: [ 'src/**/*.js' ],
			options: {
				proto: true,
				smarttabs: true,
				boss: true,
				evil: true,
				laxbreak: true,
				undef: true,
				unused: true,
				'-W018': true,
				'-W041': false,
				eqnull: true,
				strict: true,
				globals: {
					define: true,
					require: true,
					Element: true,
					window: true,
					setTimeout: true,
					setInterval: true,
					clearInterval: true,
					module: true,
					document: true,
					loadCircularDependency: true
				}
			}
		},

		jsbeautifier: {
			files: 'build/**',
			options: {
				js: {
					indentWithTabs: true,
					spaceBeforeConditional: true,
					spaceInParen: true
				}
			}
		},

		uglify: {
			'build/Library.min.js': 'build/Library.js',
		},

		copy: {
			release: {
				files: [{
					expand: true,
					cwd: 'build/',
					src: [ '**/*' ],
					dest: 'release/<%= pkg.version %>/'
				}]
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
	grunt.loadNpmTasks('grunt-jsbeautifier');

	grunt.registerTask( 'default', [
		'test',
		'clean:build',
		'concat',
		'jsbeautifier',
		'uglify'
	]);

	grunt.registerTask( 'test', [
		'clean:tmp',
		'jshint',
		'requirejs',
		'nodeunit',
		'qunit:all'
	]);

	grunt.registerTask( 'release', [ 'default', 'copy:release', 'copy:link' ] );

};
