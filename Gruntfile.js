module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        strict: true,
        esversion: 6
      },
      beforeconcat: ['Gruntfile.js', 'src/**/*.js', '!src/data/chrome_page.js', 'test/**/*.js', '!test/jasmine/lib/**/*.js', '!test/jasmine/data/console_boot.js'],
      afterconcat: ['dest/**/*.js']
    },
    jsbeautifier: {
      'default': {
        src: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!test/jasmine/lib/**/*.js', 'package.json', 'src/manifest.json', 'test/**/*.json'],
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
    copy: {
      /* Copy icons and manifest.json/package.json. Source files are copied through concat. */
      chrome: {
        files: [{
          expand: true,
          src: ['icons/icon16.png', 'icons/icon48.png', 'icons/icon128.png'],
          dest: 'dest/'
        }, {
          src: ['src/manifest.json'],
          dest: 'dest/manifest.json'
        }, {
          src: ['src/options/options.html'],
          dest: 'dest/options/options.html'
        }]
      }
    },
    clean: ['dest/', 'dest.zip'],
    replace: {
      json: {
        options: {
          patterns: [{
            match: /__VERSION__/g,
            replacement: '<%= pkg.version %>'
          }, {
            match: /__DESCRIPTION__/g,
            replacement: '<%= pkg.description %>'
          }]
        },
        files: [{
          src: ['dest/manifest.json'],
          dest: 'dest/manifest.json'
        }]
      },
      exports: {
        options: {
          patterns: [{
            match: /exports\..*=.*/g,
            replacement: ''
          }]
        },
        files: [{
          src: ['dest/**/*.js'],
          dest: './'
        }]
      }
    },
    compress: {
      main: {
        options: {
          archive: 'dest.zip'
        },
        expand: true,
        cwd: 'dest/',
        src: ['**/*']
      }
    },
    concat: {
      chrome: {
        files: {
          'dest/data/background.js': ['src/world_page.js', 'src/data/background.js'],
          'dest/data/utils.js': ['src/utils.js'],
          'dest/data/characters.js': ['src/character_page.js', 'src/data/chrome_page.js', 'src/pages/characters.js'],
          'dest/data/guilds.js': ['src/guild_page.js', 'src/data/chrome_page.js', 'src/pages/guilds.js'],
          'dest/data/highscores.js': ['src/highscore_page.js', 'src/data/chrome_page.js', 'src/pages/highscores.js'],
          'dest/options/options.js': ['src/options/options.js']
        }
      }
    },
    mocha_istanbul: {
      coverage: {
        src: 'test',
        options: {
          mask: '**/*spec.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('test', ['jshint:beforeconcat', 'mocha_istanbul']);
  grunt.registerTask('build', ['clean', 'copy', 'concat', 'replace', 'compress', 'jshint:afterconcat']);
  grunt.registerTask('travis', ['jsbeautifier:release', 'test', 'build']);
  grunt.registerTask('default', ['jsbeautifier:default', 'test', 'build']);
};
