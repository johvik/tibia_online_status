var should = require('should');

var Utils = require('../src/utils.js').Utils;

describe('Utils', function() {
  var utils = new Utils();

  describe('#to_property_name', function() {
    it('should replace 160', function() {
      var str = 'Hello' + String.fromCharCode(160) + 'World!';
      var hello_world = 'Hello World!';

      str.should.not.equal(hello_world);
      utils.to_property_name(str).should.equal(hello_world);
    });
  });

  describe('#fetch', function() {
    it('should fetch url', function(done) {
      this.timeout(5000);
      utils.fetch('http://www.google.com', function(err, data) {
        should.exist(data);
        data.should.match(/Google/);
        data.length.should.be.greaterThan(0);
        should.not.exist(err);
        done();
      });
    });

    it('should not fetch url', function(done) {
      this.timeout(5000);
      utils.fetch('http://www.google.com/testing_404', function(err, data) {
        err.should.startWith('Fetch wrong return status ');
        done();
      });
    });

    it('should not accept a Number', function(done) {
      utils.fetch(42, function(err, res) {
        err.should.startWith('Url not a String ');
        done();
      });
    });

    it('should not accept an Object', function(done) {
      utils.fetch({}, function(err, res) {
        err.should.startWith('Url not a String ');
        done();
      });
    });

    it('should not accept an Array', function(done) {
      utils.fetch(['abc'], function(err, res) {
        err.should.startWith('Url not a String ');
        done();
      });
    });

    it('should not accept an empty String', function(done) {
      utils.fetch(' ', function(err, res) {
        err.should.startWith('Empty url ');
        done();
      });
    });
  });
});
