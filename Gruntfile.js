module.exports = function (grunt) {

	requireConfig = {
		baseUrl: "src",
		paths: {
			jquery: "libs/dist/jquery",
			underscore: "libs/underscore/underscore"
		}
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!src/libs/**/*.js'],
			options: {
				globals: {
					jQuery: true
				}
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint']
		},
		jsbeautifier: {
			files: ["src/**/*.js", "!src/libs/**/*.js", "Gruntfile.js"],
			options: {
				html: {
					indentChar: "	",
					indentSize: 1
				},
				css: {
					indentChar: "	",
					indentSize: 1
				},
				js: {
					indentChar: "	",
					indentSize: 1
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: requireConfig.baseUrl,
					paths: requireConfig.paths,
					out: "dist/optimized.js",
					name: "my-view"
				}
			}
		},
		jasmine: {
			customTemplate: {
				options: {
					specs: 'tests/specs/*.js',
					template: require('grunt-template-jasmine-requirejs'),
					templateOptions: {
						requireConfig: requireConfig
					},
					vendor: [
						"https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.17/require.min.js",
						"http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"
					]
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('grunt-bower-install-task');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask("test", ["jasmine"]);
	grunt.registerTask("package", ["requirejs"]);

	grunt.registerTask('install', ['bower_install']);


};
