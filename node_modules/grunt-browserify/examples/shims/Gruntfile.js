module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      build: {
        src: ['client/*.js'],
        dest: 'public/main.js',
        options: {
          shim: {
            jQuery: {
              path: 'vendor/client/jQuery.js',
              exports: '$'
            }
          }
        }
      }
    }
  });

  grunt.loadTasks('../../tasks');

  grunt.registerTask('default', ['browserify']);
};
