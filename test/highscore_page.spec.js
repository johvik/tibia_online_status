var fs = require('fs');
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

var HighscorePage = require('../src/highscore_page.js').HighscorePage;

describe('HighscorePage', function() {
  'use strict';
  var utils = new Utils();
  var highscorePage = new HighscorePage(utils);

  describe('#parse', function() {
    beforeEach(function() {
      highscorePage = new HighscorePage(utils);
    });

    it('should not find highscores div', function(done) {
      global.document = new JSDOM('').window.document;
      highscorePage.parse(function(err) {
        err.should.equal('Highscores div not found');
        highscorePage.elements.should.eql({});
        done();
      });
    });

    it('should not find world', function(done) {
      global.document = new JSDOM('<div id="highscores"></div>').window.document;
      highscorePage.parse(function(err) {
        err.should.equal('No world found');
        highscorePage.elements.should.have.keys('highscores_div');
        done();
      });
    });

    it('should parse Antica', function(done) {
      var data = fs.readFileSync(__dirname + '/files/highscore_page_antica_magic.html', 'utf8');
      global.document = new JSDOM(data).window.document;
      highscorePage.parse(function(err) {
        should.not.exist(err);
        highscorePage.list.should.equal('magic');
        highscorePage.world.should.equal('Antica');
        highscorePage.elements.should.have.keys('highscores_div');
        done();
      });
    });

    it('should fetch and parse Candia', function(done) {
      this.timeout(5000);
      utils.fetch('http://www.tibia.com/community/?subtopic=highscores&world=Candia', function(err, data) {
        should.not.exist(err);
        global.document = new JSDOM(data).window.document;
        highscorePage.parse(function(err) {
          should.not.exist(err);
          highscorePage.list.should.equal('experience');
          highscorePage.world.should.equal('Candia');
          highscorePage.elements.should.have.keys('highscores_div');
          done();
        });
      });
    });

    it('should fetch and parse Premia secure', function(done) {
      this.timeout(5000);
      utils.fetch('https://secure.tibia.com/community/?subtopic=highscores&world=Premia', function(err, data) {
        should.not.exist(err);
        global.document = new JSDOM(data).window.document;
        highscorePage.parse(function(err) {
          should.not.exist(err);
          highscorePage.list.should.equal('experience');
          highscorePage.world.should.equal('Premia');
          highscorePage.elements.should.have.keys('highscores_div');
          done();
        });
      });
    });
  });

  describe('#update', function() {
    beforeEach(function() {
      highscorePage = new HighscorePage(utils);
    });

    it('should update Antica experience', function(done) {
      var data = fs.readFileSync(__dirname + '/files/highscore_page_antica_experience.html', 'utf8');
      global.document = new JSDOM(data).window.document;
      highscorePage.parse(function(err) {
        should.not.exist(err);
        highscorePage.list.should.equal('experience');
        highscorePage.world.should.equal('Antica');
        highscorePage.elements.should.have.keys('highscores_div');

        // Update with first and last player in the list
        highscorePage.update({
          'Battle Commander': {
            level: 72,
            vocation: 'Royal Paladin'
          },
          'Zombalil': {
            level: 447,
            vocation: 'Elite Knight'
          }
        });
        var meendel_found = false;
        var linglifer_found = false;
        var links = highscorePage.elements.highscores_div.getElementsByTagName('a');
        var link_exp = /https:\/\/secure\.tibia\.com\/community\/\?subtopic=characters&name=.+/;
        for (var i = 0, j = links.length; i < j; i++) {
          if (link_exp.test(links[i].href)) {
            var name = utils.decode(links[i].innerHTML);
            var level_column = links[i].parentElement.parentElement.getElementsByTagName('td')[3];
            if (name === 'Battle Commander') {
              meendel_found = true;
              TestUtils.rgbToHex(links[i].style.color).should.equal(utils.color.green);
              level_column.textContent.should.equal('72 (-500)');
            } else if (name === 'Zombalil') {
              linglifer_found = true;
              TestUtils.rgbToHex(links[i].style.color).should.equal(utils.color.green);
              level_column.textContent.should.equal('447 (+1)');
            } else {
              links[i].style.color.should.equal('');
              level_column.textContent.should.equal('' + parseInt(level_column.textContent, 10));
            }
          }
        }
        meendel_found.should.equal(true);
        linglifer_found.should.equal(true);
        done();
      });
    });

    it('should update Antica magic', function(done) {
      var data = fs.readFileSync(__dirname + '/files/highscore_page_antica_magic.html', 'utf8');
      global.document = new JSDOM(data).window.document;
      highscorePage.parse(function(err) {
        should.not.exist(err);
        highscorePage.list.should.equal('magic');
        highscorePage.world.should.equal('Antica');
        highscorePage.elements.should.have.keys('highscores_div');

        highscorePage.update({
          'Sioo ham': {
            level: 11,
            vocation: 'Royal Paladin'
          }
        });
        var stentung_found = false;
        var links = highscorePage.elements.highscores_div.getElementsByTagName('a');
        var link_exp = /https:\/\/secure\.tibia\.com\/community\/\?subtopic=characters&name=.+/;
        for (var i = 0, j = links.length; i < j; i++) {
          if (link_exp.test(links[i].href)) {
            var name = utils.decode(links[i].innerHTML);
            var level_column = links[i].parentElement.parentElement.getElementsByTagName('td')[3];
            if (name === 'Sioo ham') {
              stentung_found = true;
              TestUtils.rgbToHex(links[i].style.color).should.equal(utils.color.green);
              level_column.textContent.should.equal('106');
            } else {
              links[i].style.color.should.equal('');
              level_column.textContent.should.equal('' + parseInt(level_column.textContent, 10));
            }
          }
        }
        stentung_found.should.equal(true);
        done();
      });
    });
  });

  describe('#toString', function() {
    beforeEach(function() {
      highscorePage = new HighscorePage(utils);
    });

    it('should have keys', function() {
      var str = highscorePage.toString();
      str.should.have.keys('list', 'world', 'elements');
    });
  });
});
