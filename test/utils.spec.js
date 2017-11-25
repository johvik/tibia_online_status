var should = require('should');
const jsdom = require('jsdom');
const {
  JSDOM
} = jsdom;
jsdom.defaultDocumentFeatures = {
  FetchExternalResources: false,
  ProcessExternalResources: false
};
var TestUtils = require('./test_utils.js');

global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Utils = require('../src/utils.js').Utils;

describe('Utils', function() {
  'use strict';
  var utils = new Utils();

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

  describe('#findOnlineCharacters', function() {
    it('should find online', function() {
      var document = new JSDOM('<a href="https://secure.tibia.com/community/?subtopic=characters&name=Chorizo%27korv">Chorizo\'korv</a><a href="https://secure.tibia.com/community/?subtopic=characters&name=Bubble">Bubble</a>').window.document;
      var online = utils.findOnlineCharacters(document, {
        'Bubble': {
          level: 100,
          vocation: 'Knight'
        }
      });
      online.should.have.lengthOf(1);
      online[0].should.have.keys('link', 'player');
      should.exist(online[0].link);
      online[0].player.should.eql({
        level: 100,
        vocation: 'Knight'
      });
    });
  });

  describe('#markOnlineLinks', function() {
    it('should mark online green', function() {
      var document = new JSDOM('<a href="https://secure.tibia.com/community/?subtopic=characters&name=Chorizo%27korv">Chorizo\'korv</a><a href="https://secure.tibia.com/community/?subtopic=characters&name=Bubble">Bubble</a>').window.document;
      var online = utils.markOnlineLinks(document, {
        'Chorizo\'korv': {
          level: 500,
          vocation: 'None'
        }
      });
      online.should.have.lengthOf(1);
      online[0].should.have.keys('link', 'player');
      should.exist(online[0].link);
      online[0].player.should.eql({
        level: 500,
        vocation: 'None'
      });
      var links = document.getElementsByTagName('a');
      TestUtils.rgbToHex(links[0].style.color).should.equal(utils.color.green);
      links[1].style.color.should.equal('');
    });
  });

  describe('#setLevel', function() {
    it('should not change', function() {
      var document = new JSDOM('<div>abc</div>').window.document;
      var elements = document.getElementsByTagName('div');
      elements.should.have.length(1);
      utils.setLevel(elements[0], 1, 1);
      elements[0].textContent.should.equal('abc');
    });

    it('should change positive', function() {
      var document = new JSDOM('<div>abc</div>').window.document;
      var elements = document.getElementsByTagName('div');
      elements.should.have.length(1);
      utils.setLevel(elements[0], 1, 2);
      elements[0].textContent.should.equal('2 (+1)');
    });

    it('should change negative', function() {
      var document = new JSDOM('<div>abc</div>').window.document;
      var elements = document.getElementsByTagName('div');
      elements.should.have.length(1);
      utils.setLevel(elements[0], 2, 1);
      elements[0].textContent.should.equal('1 (-1)');
    });
  });

  describe('#parseAndSetLevel', function() {
    it('should not change', function() {
      var document = new JSDOM('<div>abc</div>').window.document;
      var elements = document.getElementsByTagName('div');
      elements.should.have.length(1);
      utils.parseAndSetLevel(elements[0], 1);
      elements[0].textContent.should.equal('abc');
    });

    it('should set level', function() {
      var document = new JSDOM('<div>1</div>').window.document;
      var elements = document.getElementsByTagName('div');
      elements.should.have.length(1);
      utils.parseAndSetLevel(elements[0], 20);
      elements[0].textContent.should.equal('20 (+19)');
    });
  });
});
