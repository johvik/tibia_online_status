var should = require('should');
var jsdom = require('jsdom').jsdom;
require('jsdom').defaultDocumentFeatures = {
  FetchExternalResources: false,
  ProcessExternalResources: false
};
var TestUtils = require('./test_utils.js');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Utils = require('../src/common/utils.js').Utils;

describe('Utils', function() {
  var utils = new Utils(XMLHttpRequest);

  describe('#decode', function() {
    it('should replace &#160;', function() {
      var str = 'Hello&#160;World!';
      var hello_world = 'Hello World!';

      str.should.not.equal(hello_world);
      utils.decode(str).should.equal(hello_world);
    });

    it('should replace &nbsp;', function() {
      var str = 'Hello&nbsp;World!';
      var hello_world = 'Hello World!';

      str.should.not.equal(hello_world);
      utils.decode(str).should.equal(hello_world);
    });

    it('should replace combined', function() {
      var str = 'Hello&nbsp;&nbsp;&#160;&#160;&nbsp;World!';
      var hello_world = 'Hello     World!';

      str.should.not.equal(hello_world);
      utils.decode(str).should.equal(hello_world);
    });
  });

  describe('#isVocation', function() {
    it('should be vocations', function() {
      utils.isVocation('Druid').should.equal(true);
      utils.isVocation('Elder Druid').should.equal(true);
      utils.isVocation('Elite Knight').should.equal(true);
      utils.isVocation('Knight').should.equal(true);
      utils.isVocation('Master Sorcerer').should.equal(true);
      utils.isVocation('None').should.equal(true);
      utils.isVocation('Paladin').should.equal(true);
      utils.isVocation('Royal Paladin').should.equal(true);
      utils.isVocation('Sorcerer').should.equal(true);
    });

    it('should not be vocations', function() {
      utils.isVocation(' Druid').should.equal(false);
      utils.isVocation('druid').should.equal(false);
      utils.isVocation('Some text').should.equal(false);
      utils.isVocation(9).should.equal(false);
    });
  });

  describe('#fetch', function() {
    it('should fetch url', function(done) {
      utils.fetch('http://www.google.com', function(err, data) {
        should.exist(data);
        data.should.match(/Google/);
        data.length.should.be.greaterThan(0);
        should.not.exist(err);
        done();
      });
    });

    it('should not fetch url', function(done) {
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
  });

  describe('#markOnlineLinks', function() {
    it('should mark online green', function() {
      var document = jsdom('<a href="http://www.tibia.com/community/?subtopic=characters&name=Chorizo%27korv">Chorizo\'korv</a><a href="http://www.tibia.com/community/?subtopic=characters&name=Bubble">Bubble</a>');
      utils.markOnlineLinks(document, {
        'Chorizo\'korv': {}
      });
      var links = document.getElementsByTagName('a');
      TestUtils.rgbToHex(links[0].style.color).should.equal(utils.color.green);
      links[1].style.color.should.equal('');
    });

    it('should fetch and mark online green', function(done) {
      this.timeout(7000);
      utils.fetch('http://www.tibia.com/community/?subtopic=guilds&page=view&GuildName=Red+Rose', function(err, data) {
        should.not.exist(err);
        var document = jsdom(data);
        utils.markOnlineLinks(document, {
          'Halfhigh': {}
        });
        // Look for Halfhigh(online) and Buffy(offline)
        var links = document.getElementsByTagName('a');
        var found_halfhigh = false;
        var found_buffy = false;
        for (var i = 0, j = links.length; i < j; i++) {
          var name = links[i].textContent;
          if (name === 'Halfhigh') {
            found_halfhigh.should.equal(false);
            found_halfhigh = true;
            TestUtils.rgbToHex(links[i].style.color).should.equal(utils.color.green);
          } else if (name === 'Buffy') {
            found_buffy.should.equal(false);
            found_buffy = true;
            links[i].style.color.should.equal('');
          }
        }
        found_halfhigh.should.equal(true);
        found_buffy.should.equal(true);
        done();
      });
    });
  });
});
