module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      vendor: {
        src: ['vendor/client/**/*.js'],
        dest: 'public/vendor.js',
        options: {
          shim: {
            jQuery: {
              path: 'vendor/client/jQuery.js',
              exports: '$'
            }
          }
        }
      },
      client: {
        src: ['client/**/*.js'],
        dest: 'public/app.js',
        options: {
          external: ["jQuery"]
        }
      },
    },

    concat: {
      'public/main.js': ['public/vendor.js', 'public/app.js']
    }

  });

  grunt.loadTasks('../../tasks');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['browserify', 'concat']);
};
