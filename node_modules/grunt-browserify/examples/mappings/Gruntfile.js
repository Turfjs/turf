module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      basic: {
        src: ['client/entry.js'],
        dest: 'public/main.js',
        options: {
          aliasMappings: [
            {
              cwd: 'shared',
              src: ['**/*.js'],
              dest: 'lib',
            },
          ]
        }
      }
    }
  });

  grunt.loadTasks('../../tasks');

  grunt.registerTask('default', ['browserify']);
};
