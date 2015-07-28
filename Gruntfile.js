module.exports = function(grunt) {

	grunt.initConfig({
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
		"jsbeautifier": {
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
		}
	});
	grunt.loadNpmTasks('grunt-jsbeautifier');

	grunt.loadNpmTasks('grunt-contrib-jshint');


};
