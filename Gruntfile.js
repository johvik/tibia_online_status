module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true
        }
      }
    },
    jsbeautifier: {
      'default': {
        src: ['<%= jshint.files %>', 'package.json', 'manifest.json'],
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
        src: ['<%= jsbeautifier.default.src %>', 'package.json', 'manifest.json'],
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
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
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
          src: ['icons/**/*.png'],
          dest: 'dest/chrome/'
        }, {
          expand: true,
          src: ['lib/**'],
          dest: 'dest/chrome/'
        }, {
          expand: true,
          src: ['manifest.json'],
          dest: 'dest/chrome/'
        }, {
          expand: true,
          src: ['src/*.js'],
          dest: 'dest/chrome/'
        }, {
          expand: true,
          src: ['src/chrome/*.js'],
          dest: 'dest/chrome/'
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
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-replace');

  grunt.registerTask('test', ['jshint', 'mochaTest']);
  grunt.registerTask('release', ['jsbeautifier:release', 'jshint', 'mochaTest', 'clean', 'copy:chrome', 'replace']);
  grunt.registerTask('default', ['jsbeautifier:default', 'jshint', 'mochaTest']);
};
