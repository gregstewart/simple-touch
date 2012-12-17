module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ['grunt.js', '../../src/simple-touch.js', '../../src/touch-utils.js']
    },
    jshint: {
      options: {
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    min: {
      dist: {
        src: ['../../src/simple-touch.js', '../../src/touch-utils.js'],
        dest: '../../dist/simple-touch.min.js'
      }
    },
    uglify: {}
  });

  // Default task.
  grunt.registerTask('default', 'lint min');

};