module.exports = function (grunt) {
  'use strict';
  // Project configuration.
  grunt.initConfig({

    clean: {
      tests: ['tmp']
    },

    jshint: {
      all: ['Gruntfile.js', 'tasks/**/*.js', '<%= nodeunit.tests %>'],
      options: {
        jshintrc: ".jshintrc"
      }
    },

    browserify: {
      basic: {
        src: ['test/fixtures/basic/*.js'],
        dest: 'tmp/basic.js'
      },

      ignores: {
        src: ['test/fixtures/ignore/*.js'],
        dest: 'tmp/ignores.js',
        options: {
          ignore: ['test/fixtures/ignore/ignore.js', 'os']
        }
      },

      alias: {
        src: ['test/fixtures/alias/entry.js'],
        dest: 'tmp/alias.js',
        options: {
          alias: ['test/fixtures/alias/toBeAliased.js:alias']
        }
      },

      aliasString: {
        src: ['test/fixtures/alias/entry.js'],
        dest: 'tmp/aliasString.js',
        options: {
          alias: 'test/fixtures/alias/toBeAliased.js:alias'
        }
      },

      aliasMappings: {
        src: ['test/fixtures/aliasMappings/**/*.js'],
        dest: 'tmp/aliasMappings.js',
        options: {
          aliasMappings: [
            {
              cwd: 'test/fixtures/aliasMappings/',
              src: ['**/*.js'],
              dest: 'tmp/shortcut/',
              flatten: true
            },
            {
              cwd: 'test/fixtures/aliasMappings/foo/',
              src: ['**/*.js'],
              dest: 'tmp/other/'
            }
          ]
        }
      },

      external: {
        src: ['test/fixtures/external/entry.js', 'text/fixtures/external/b.js'],
        dest: 'tmp/external.js',
        options: {
          external: ['test/fixtures/external/a.js', 'events', 'vendor/alias']
        }
      },

      'external-dir': {
        src: ['test/fixtures/external-dir/*.js'],
        dest: 'tmp/external-dir.js',
        options: {
          external: ['test/fixtures/external-dir/b']
        }
      },

      externalize: {
        src: ['test/fixtures/externalize/b.js'],
        dest: 'tmp/externalize.js',
        options: {
          alias: [
            'test/fixtures/externalize/a.js:test/fixtures/externalize/a.js',
            'events'
          ]
        }
      },

      extentions: {
        src: ['test/fixtures/extensions/extension.js'],
        dest: 'tmp/extensions.js',
        options: {
          extensions: ['.js', '.fjs']
        }
      },

      noParse: {
        src: ['test/fixtures/noParse/*.js'],
        dest: 'tmp/noParse.js',
        options: {
          noParse: ['test/fixtures/noParse/jquery.js']
        }
      },

      shim: {
        src: ['test/fixtures/shim/a.js', 'test/fixtures/shim/shim.js'],
        dest: 'tmp/shim.js',
        options: {
          shim: {
            shimmedJQ: {
              path: 'test/fixtures/shim/jquery.js',
              exports: '$'
            }
          }
        }
      },

      shimMulti: {
        files: {
          'tmp/shim-a.js': ['test/fixtures/shim/a.js', 'test/fixtures/shim/shim.js'],
          'tmp/shim-b.js': ['test/fixtures/shim/a.js', 'test/fixtures/shim/shim.js']
        },
        options: {
          shim: {
            shimmedJQ: {
              path: 'test/fixtures/shim/jquery.js',
              exports: '$'
            }
          }
        }
      },

      shimNoParse: {
        src: ['test/fixtures/shim/a.js', 'test/fixtures/shim/shim.js'],
        dest: 'tmp/shimNoParse.js',
        options: {
          noParse: ['test/fixtures/shim/jquery.js'],
          shim: {
            shimmedJQ: {
              path: 'test/fixtures/shim/jquery.js',
              exports: '$'
            }
          }
        }
      },
      sourceMaps: {
        src: ['test/fixtures/basic/*.js'],
        dest: 'tmp/sourceMaps.js',
        options: {
          debug: true
        }
      },

      postBundleCB: {
        src: ['test/fixtures/basic/*.js'],
        dest: 'tmp/post.js',
        options: {
          postBundleCB: function(err, src, done) {
            require('fs').appendFileSync('tmp/post.txt', 'Hello World!')
            done();
          }
        }
      }
    },

    nodeunit: {
      tests: ['test/*_test.js']
    }


  });

  // Load local tasks.
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Default task.
  grunt.registerTask('test', ['clean', 'browserify', 'nodeunit']);
  grunt.registerTask('default', ['jshint', 'test']);
};
