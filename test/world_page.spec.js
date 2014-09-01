var fs = require('fs');
var should = require('should');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Utils = require('../src/common/utils.js').Utils;
var MemoryStorage = require('../src/common/memory_storage.js').MemoryStorage;

var WorldPage = require('../src/common/world_page.js').WorldPage;

describe('WorldPage', function() {
  var utils = new Utils(XMLHttpRequest);
  var memoryStorage = new MemoryStorage();
  var worldPage = new WorldPage(utils, memoryStorage);

  describe('#parse', function() {
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

    it('should not parse suspicious row', function(done) {
      worldPage.parse('<tr><td><a href="http://www.tibia.com/community/?subtopic=characters&name=Chorizo%27korv">Chorizo\'korv</a></td><td>70</td><td>Elite&#160;Sorcerer</td></tr>', function(err, res) {
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
      should.not.exist(worldPage.storage.get('Antica'));
      var time = new Date().getTime();
      worldPage.query('Antica', function(err, res) {
        should.not.exist(err);
        should.exist(res);
        var antica = worldPage.storage.get('Antica');
        should.exist(antica);
        antica.players.should.eql(res);
        antica.time.should.be.within(time, time + worldPage.cache_time);
        done();
      });
    });

    it('should use cached Antica', function(done) {
      var antica = worldPage.storage.get('Antica');
      should.exist(antica);
      var old_time = antica.time;
      var now = new Date().getTime();
      now.should.be.within(old_time, old_time + worldPage.cache_time);
      worldPage.query('Antica', function(err, res) {
        should.not.exist(err);
        should.exist(res);
        var antica = worldPage.storage.get('Antica');
        should.exist(antica);
        antica.players.should.eql(res);
        old_time.should.equal(antica.time);
        done();
      });
    });

    it('should not use cached Antica', function(done) {
      var antica = worldPage.storage.get('Antica');
      should.exist(antica);
      // Move so its time to refresh cache
      antica.time -= worldPage.cache_time;
      worldPage.storage.set('Antica', antica);
      var old_time = antica.time;
      worldPage.query('Antica', function(err, res) {
        should.not.exist(err);
        should.exist(res);
        var antica = worldPage.storage.get('Antica');
        should.exist(antica);
        antica.players.should.eql(res);
        antica.time.should.be.above(old_time);
        done();
      });
    });
  });
});
