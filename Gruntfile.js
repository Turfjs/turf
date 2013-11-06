module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        jshintrc: "./.jshintrc"
      },
      all: ['./lib/*.js', './lib/*/*.js']
    },
    browserify: {
      all: {
        files: {
          'turf.js': ['index.js'],
        }
      }
    },
    uglify: {
      options: {
        report: 'gzip'
      },
      all: {
        src: 'turf.js',
        dest: 'turf.min.js'
      }
    }
  });
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['browserify', 'uglify']);
};
