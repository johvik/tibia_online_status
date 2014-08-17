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
        src: '<%= jshint.files %>',
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
        src: '<%= jsbeautifier.default.src %>',
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
    clean: ['dest/']
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('test', ['jshint', 'mochaTest']);
  grunt.registerTask('release', ['jsbeautifier:release', 'jshint', 'mochaTest', 'clean', 'copy:chrome']);
  grunt.registerTask('default', ['jsbeautifier:default', 'jshint', 'mochaTest']);
};
