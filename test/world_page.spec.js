var fs = require('fs');
var should = require('should');

global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Utils = require('../src/utils.js').Utils;

var WorldPage = require('../src/world_page.js').WorldPage;

describe('WorldPage', function() {
  var utils = new Utils();
  var worldPage = new WorldPage(utils);

  describe('#parse', function() {
    this.timeout(5000);

    it('should parse Antica', function(done) {
      var data = fs.readFileSync(__dirname + '/files/world_page_antica_633.html', 'utf8');
      var expected = require('./files/world_page_antica_633.expected.js').expected;
      worldPage.parse(data, function(err, res) {
        should.not.exist(err);
        res.should.eql(expected);
        Object.keys(res).should.have.length(633);
        done();
      });
    });

    it('should parse Inferna', function(done) {
      var data = fs.readFileSync(__dirname + '/files/world_page_inferna_7.html', 'utf8');
      var expected = require('./files/world_page_inferna_7.expected.js').expected;
      worldPage.parse(data, function(err, res) {
        should.not.exist(err);
        res.should.eql(expected);
        Object.keys(res).should.have.length(7);
        done();
      });
    });

    it('should parse offline Magera', function(done) {
      var data = fs.readFileSync(__dirname + '/files/world_page_magera_offline.html', 'utf8');
      worldPage.parse(data, function(err, res) {
        should.not.exist(err);
        res.should.eql({});
        Object.keys(res).should.have.length(0);
        done();
      });
    });

    it('should parse empty String', function(done) {
      worldPage.parse(' ', function(err, res) {
        should.not.exist(err);
        res.should.eql({});
        done();
      });
    });

    it('should not parse a Number', function(done) {
      worldPage.parse(42, function(err, res) {
        err.should.startWith('Data not a String ');
        done();
      });
    });

    it('should not parse an Object', function(done) {
      worldPage.parse({}, function(err, res) {
        err.should.startWith('Data not a String ');
        done();
      });
    });

    it('should not parse an Array', function(done) {
      worldPage.parse(['abc'], function(err, res) {
        err.should.startWith('Data not a String ');
        done();
      });
    });
  });

  describe('#query', function() {
    it('should not query a Number', function(done) {
      worldPage.query(42, function(err, res) {
        err.should.startWith('World name not a String ');
        done();
      });
    });

    it('should not query an Object', function(done) {
      worldPage.query({}, function(err, res) {
        err.should.startWith('World name not a String ');
        done();
      });
    });

    it('should not query an Array', function(done) {
      worldPage.query(['abc'], function(err, res) {
        err.should.startWith('World name not a String ');
        done();
      });
    });

    it('should not query an empty String', function(done) {
      worldPage.query(' ', function(err, res) {
        err.should.startWith('Empty world name ');
        done();
      });
    });
  });
});
