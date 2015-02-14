module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!test/jasmine/lib/**/*.js']
    },
    jsbeautifier: {
      'default': {
        src: ['<%= jshint.files %>', 'package.json', 'src/chrome/manifest.json', 'src/firefox/package.json', 'test/**/*.json'],
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
      /* Copy icons and manifest.json/package.json. Source files are copied through concat. */
      chrome: {
        files: [{
          expand: true,
          src: ['icons/icon16.png', 'icons/icon48.png', 'icons/icon128.png'],
          dest: 'dest/chrome/'
        }, {
          src: ['src/chrome/manifest.json'],
          dest: 'dest/chrome/manifest.json'
        }]
      },
      firefox: {
        files: [{
          expand: true,
          src: ['icons/icon48.png', 'icons/icon64.png'],
          dest: 'dest/firefox/'
        }, {
          src: ['src/firefox/package.json'],
          dest: 'dest/firefox/package.json'
        }]
      }
    },
    clean: ['dest/'],
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
          src: ['dest/chrome/manifest.json'],
          dest: 'dest/chrome/manifest.json'
        }, {
          src: ['dest/firefox/package.json'],
          dest: 'dest/firefox/package.json'
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
          src: ['dest/**/*.js', '!dest/firefox/lib/**/*.js'],
          dest: './'
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
    },
    concat: {
      chrome: {
        files: {
          'dest/chrome/data/background.js': ['src/common/world_page.js', 'src/chrome/data/background.js'],
          'dest/chrome/data/utils.js': ['src/common/utils.js', 'src/chrome/data/chrome_page.js'],
          'dest/chrome/data/characters.js': ['src/common/character_page.js', 'src/common/pages/characters.js'],
          'dest/chrome/data/highscores.js': ['src/common/highscore_page.js', 'src/common/pages/highscores.js']
        }
      },
      firefox: {
        files: {
          'dest/firefox/lib/main.js': ['src/firefox/lib/main.js'],
          'dest/firefox/lib/world_page.js': ['src/common/world_page.js'],
          'dest/firefox/lib/utils.js': ['src/common/utils.js'],
          'dest/firefox/data/utils.js': ['src/common/utils.js', 'src/firefox/data/firefox_page.js'],
          'dest/firefox/data/characters.js': ['src/common/character_page.js', 'src/common/pages/characters.js'],
          'dest/firefox/data/highscores.js': ['src/common/highscore_page.js', 'src/common/pages/highscores.js']
        }
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
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test', ['jshint', 'mochacov:test']);
  grunt.registerTask('cov', ['jshint', 'mochacov:cov']);
  grunt.registerTask('travis', ['jsbeautifier:release', 'jshint', 'mochacov:test', 'mochacov:travis', 'clean', 'copy', 'concat', 'replace', 'compress']);
  grunt.registerTask('default', ['jsbeautifier:default', 'jshint', 'mochacov:test', 'clean', 'copy', 'concat', 'replace', 'compress']);
};
