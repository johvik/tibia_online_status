var fs = require('fs');
var should = require('should');
var jsdom = require('jsdom').jsdom;
require('jsdom').defaultDocumentFeatures = {
  FetchExternalResources: false,
  ProcessExternalResources: false
};
var TestUtils = require('./test_utils.js');

global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Utils = require('../src/common/utils.js').Utils;

var HighscorePage = require('../src/common/highscore_page.js').HighscorePage;

describe('HighscorePage', function() {
  'use strict';
  var utils = new Utils();
  var highscorePage = new HighscorePage(utils);

  describe('#parse', function() {
    beforeEach(function() {
      highscorePage = new HighscorePage(utils);
    });

    it('should not find highscores div', function(done) {
      global.document = jsdom('');
      highscorePage.parse(function(err) {
        err.should.equal('Highscores div not found');
        highscorePage.elements.should.eql({});
        done();
      });
    });

    it('should not find world', function(done) {
      global.document = jsdom('<div id="highscores"></div>');
      highscorePage.parse(function(err) {
        err.should.equal('No world found');
        highscorePage.elements.should.have.keys('highscores_div');
        done();
      });
    });

    it('should parse Antica', function(done) {
      var data = fs.readFileSync(__dirname + '/files/highscore_page_antica_magic.html', 'utf8');
      global.document = jsdom(data);
      highscorePage.parse(function(err) {
        should.not.exist(err);
        highscorePage.list.should.equal('Magic Level');
        highscorePage.world.should.equal('Antica');
        highscorePage.elements.should.have.keys('highscores_div');
        done();
      });
    });

    it('should fetch and parse Aurera', function(done) {
      this.timeout(5000);
      utils.fetch('http://www.tibia.com/community/?subtopic=highscores&world=Aurera', function(err, data) {
        should.not.exist(err);
        global.document = jsdom(data);
        highscorePage.parse(function(err) {
          should.not.exist(err);
          highscorePage.list.should.equal('Experience');
          highscorePage.world.should.equal('Aurera');
          highscorePage.elements.should.have.keys('highscores_div');
          done();
        });
      });
    });

    it('should fetch and parse Inferna secure', function(done) {
      this.timeout(5000);
      utils.fetch('https://secure.tibia.com/community/?subtopic=highscores&world=Inferna', function(err, data) {
        should.not.exist(err);
        global.document = jsdom(data);
        highscorePage.parse(function(err) {
          should.not.exist(err);
          highscorePage.list.should.equal('Experience');
          highscorePage.world.should.equal('Inferna');
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
      global.document = jsdom(data);
      highscorePage.parse(function(err) {
        should.not.exist(err);
        highscorePage.list.should.equal('Experience');
        highscorePage.world.should.equal('Antica');
        highscorePage.elements.should.have.keys('highscores_div');

        // Update with first and last player in the list
        highscorePage.update({
          'Meendel': {
            level: 11,
            vocation: 'Royal Paladin'
          },
          'Linglifer': {
            level: 427,
            vocation: 'Master Sorcerer'
          }
        });
        var meendel_found = false;
        var linglifer_found = false;
        var links = highscorePage.elements.highscores_div.getElementsByTagName('a');
        var link_exp = /https:\/\/secure\.tibia\.com\/community\/\?subtopic=characters&name=.+/;
        for (var i = 0, j = links.length; i < j; i++) {
          if (link_exp.test(links[i].href)) {
            var name = utils.decode(links[i].innerHTML);
            var level_column = links[i].parentElement.parentElement.getElementsByTagName('td')[2];
            if (name === 'Meendel') {
              meendel_found = true;
              TestUtils.rgbToHex(links[i].style.color).should.equal(utils.color.green);
              level_column.textContent.should.equal('11 (-500)');
            } else if (name === 'Linglifer') {
              linglifer_found = true;
              TestUtils.rgbToHex(links[i].style.color).should.equal(utils.color.green);
              level_column.textContent.should.equal('427 (+1)');
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
      global.document = jsdom(data);
      highscorePage.parse(function(err) {
        should.not.exist(err);
        highscorePage.list.should.equal('Magic Level');
        highscorePage.world.should.equal('Antica');
        highscorePage.elements.should.have.keys('highscores_div');

        highscorePage.update({
          'Stentung': {
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
            var level_column = links[i].parentElement.parentElement.getElementsByTagName('td')[2];
            if (name === 'Stentung') {
              stentung_found = true;
              TestUtils.rgbToHex(links[i].style.color).should.equal(utils.color.green);
              level_column.textContent.should.equal('99');
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
