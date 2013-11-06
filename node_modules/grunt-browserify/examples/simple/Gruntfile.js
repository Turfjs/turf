module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      basic: {
        src: ['client/simple.js'],
        dest: 'public/main.js'
      }
    }
  });

  grunt.loadTasks('../../tasks');

  grunt.registerTask('default', ['browserify']);
};
