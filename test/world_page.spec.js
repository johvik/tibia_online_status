var should = require('should');

global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var utils = new require('../src/utils.js').Utils;

var WorldPage = require('../src/world_page.js').WorldPage;

describe('WorldPage', function() {
  var worldPage = new WorldPage(utils);

  describe('#query', function() {
    it('should not accept a Number', function(done) {
      worldPage.query(42, function(err, res) {
        err.should.startWith('World name not a String ');
        done();
      });
    });

    it('should not accept an Object', function(done) {
      worldPage.query({}, function(err, res) {
        err.should.startWith('World name not a String ');
        done();
      });
    });

    it('should not accept an Array', function(done) {
      worldPage.query(['abc'], function(err, res) {
        err.should.startWith('World name not a String ');
        done();
      });
    });

    it('should not accept an empty String', function(done) {
      worldPage.query(' ', function(err, res) {
        err.should.startWith('Empty world name ');
        done();
      });
    });
  });
});
