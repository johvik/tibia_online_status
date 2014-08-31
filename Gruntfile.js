module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },
    jsbeautifier: {
      'default': {
        src: ['<%= jshint.files %>', 'package.json', 'src/chrome/manifest.json', 'src/firefox/package.json'],
        options: {
          html: {
            indentSize: 2,
            maxPreserveNewlines: 1
          },
          css: {
            indentSize: 2
          },
          js: {
            indentSize: 2
          }
        }
      },
      release: {
        src: ['<%= jsbeautifier.default.src %>'],
        options: {
          mode: 'VERIFY_ONLY',
          html: {
            indentSize: 2,
            maxPreserveNewlines: 1
          },
          css: {
            indentSize: 2
          },
          js: {
            indentSize: 2
          }
        }
      }
    },
    mochacov: {
      test: {
        options: {
          reporter: 'spec'
        },
      },
      cov: {
        options: {
          reporter: 'html-cov',
          output: 'coverage.html'
        }
      },
      travis: {
        options: {
          coveralls: true
        }
      },
      options: {
        files: 'test/**/*spec.js'
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'mochaTest']
    },
    copy: {
      chrome: {
        files: [{
          expand: true,
          src: ['icons/icon16.png', 'icons/icon48.png', 'icons/icon128.png'],
          dest: 'dest/chrome/'
        }, {
          expand: true,
          cwd: 'src/chrome/',
          src: ['**/*'],
          dest: 'dest/chrome/'
        }, {
          expand: true,
          flatten: true,
          src: ['src/common/**/*.js'],
          dest: 'dest/chrome/data/'
        }]
      },
      firefox: {
        files: [{
          expand: true,
          src: ['icons/icon48.png', 'icons/icon64.png'],
          dest: 'dest/firefox/'
        }, {
          expand: true,
          cwd: 'src/firefox/',
          src: ['**/*', '!**/test/**'],
          dest: 'dest/firefox/'
        }, {
          expand: true,
          flatten: true,
          src: ['src/common/**/*.js', '!**/world_page.js'],
          dest: 'dest/firefox/data/'
        }, {
          expand: true,
          flatten: true,
          src: ['src/common/world_page.js', 'src/common/utils.js'],
          dest: 'dest/firefox/lib/'
        }]
      }
    },
    clean: ['dest/'],
    replace: {
      dist: {
        options: {
          patterns: [{
            match: /__VERSION__/,
            replacement: '<%= pkg.version %>'
          }, {
            match: /__DESCRIPTION__/,
            replacement: '<%= pkg.description %>'
          }]
        },
        files: [{
          src: ['dest/chrome/manifest.json'],
          dest: 'dest/chrome/manifest.json'
        }, {
          src: ['dest/firefox/package.json'],
          dest: 'dest/firefox/package.json'
        }]
      }
    },
    compress: {
      main: {
        options: {
          archive: 'dest/chrome.zip'
        },
        expand: true,
        cwd: 'dest/chrome/',
        src: ['**/*']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-mocha-cov');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('test', ['jshint', 'mochacov:test']);
  grunt.registerTask('cov', ['jshint', 'mochacov:cov']);
  grunt.registerTask('travis', ['jsbeautifier:release', 'jshint', 'mochacov:test', 'mochacov:travis', 'clean', 'copy', 'replace', 'compress']);
  grunt.registerTask('default', ['jsbeautifier:default', 'jshint', 'mochacov:test', 'clean', 'copy', 'replace', 'compress']);
};
