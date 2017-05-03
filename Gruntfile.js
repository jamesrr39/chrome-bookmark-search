module.exports = function (grunt) {

	var requireConfig = {
		baseUrl: "src",
		paths: {
       		        jquery: "libs/jquery/dist/jquery",
	                text: "libs/text/text",
        	        lunr: "libs/lunr/lunr",
	                mustache: "libs/mustache.js/mustache",
	                underscore: "libs/underscore/underscore"
		}
	};

	var jsFiles = ["src/**/*.js",
		"!src/libs/**/*.js",
		"tests/**/.js",
		"*.js",
		"*.json"
	];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: jsFiles,
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
			files: jsFiles,
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
					indentSize: 1,
					"jslint-happy": true
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: requireConfig.baseUrl,
					paths: requireConfig.paths,
					out: "dist/main.js",
					name: "main"
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
					}
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-jsbeautifier');
	grunt.loadNpmTasks('grunt-bower-install-task');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask("test", ["jasmine", "jshint"]);
	grunt.registerTask("package", ["requirejs"]);

	grunt.registerTask('install', ['bower_install']);


};
