var fs = require('fs');
var should = require('should');

global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Utils = require('../src/utils.js').Utils;

var WorldPage = require('../src/world_page.js').WorldPage;

describe('WorldPage', function() {
  'use strict';
  var utils = new Utils();
  var worldPage = new WorldPage(utils);

  describe('#parse', function() {
    it('should parse Antica', function(done) {
      var data = fs.readFileSync(__dirname + '/files/world_page_antica_613.html', 'utf8');
      var expected = require('./files/world_page_antica_613.expected.js').expected;
      worldPage.parse(data, function(err, res) {
        should.not.exist(err);
        res.should.eql(expected);
        Object.keys(res).should.have.length(613);
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

    it('should not parse suspicious row', function(done) {
      worldPage.parse('<tr><td><a href="https://secure.tibia.com/community/?subtopic=characters&name=Chorizo%27korv">Chorizo\'korv</a></td><td>70</td><td>Elite&#160;Sorcerer</td></tr>', function(err, res) {
        err.should.startWith('Suspicious row match, name: ');
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

    it('should query Antica', function(done) {
      this.timeout(5000);
      worldPage.worlds_cache.should.eql({});
      var time = new Date().getTime();
      worldPage.query('Antica', function(err, res) {
        should.not.exist(err);
        should.exist(res);
        worldPage.worlds_cache.should.have.keys('Antica');
        worldPage.worlds_cache.Antica.time.should.be.within(time, time + worldPage.cache_time);
        done();
      });
    });

    it('should use cached Antica', function(done) {
      worldPage.worlds_cache.should.have.keys('Antica');
      var time = worldPage.worlds_cache.Antica.time;
      var now = new Date().getTime();
      now.should.be.within(time, time + worldPage.cache_time);
      worldPage.query('Antica', function(err, res) {
        should.not.exist(err);
        should.exist(res);
        time.should.equal(worldPage.worlds_cache.Antica.time);
        worldPage.worlds_cache.should.have.keys('Antica');
        done();
      });
    });

    it('should not use cached Antica', function(done) {
      this.timeout(5000);
      worldPage.worlds_cache.should.have.keys('Antica');
      // Move so its time to refresh cache
      worldPage.worlds_cache.Antica.time -= worldPage.cache_time + 1;
      var time = worldPage.worlds_cache.Antica.time;
      worldPage.query('Antica', function(err, res) {
        should.not.exist(err);
        should.exist(res);
        worldPage.worlds_cache.Antica.time.should.be.above(time);
        worldPage.worlds_cache.should.have.keys('Antica');
        done();
      });
    });

    it('should fail on fetch', function(done) {
      var UtilsStub = function() {};
      UtilsStub.prototype.fetch = function(url, callback) {
        return callback('My error', '');
      };
      var worldPageStub = new WorldPage(new UtilsStub());

      worldPageStub.query('dummy', function(err, res) {
        err.should.equal('My error');
        done();
      });
    });

    it('should fail on parse', function(done) {
      var UtilsStub = function() {};
      UtilsStub.prototype.fetch = function(url, callback) {
        return callback(null, null);
      };
      var worldPageStub = new WorldPage(new UtilsStub());

      worldPageStub.query('dummy', function(err, res) {
        err.should.startWith('Data not a String ');
        done();
      });
    });
  });
});
