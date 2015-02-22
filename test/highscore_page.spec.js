var fs = require('fs');
var should = require('should');
var jsdom = require('jsdom').jsdom;
require('jsdom').defaultDocumentFeatures = {
  FetchExternalResources: false,
  ProcessExternalResources: false
};
var TestUtils = require('./test_utils.js');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Utils = require('../src/common/utils.js').Utils;

var HighscorePage = require('../src/common/highscore_page.js').HighscorePage;

describe('HighscorePage', function() {
  var utils = new Utils(XMLHttpRequest);
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
  });

  describe('#update', function() {
    beforeEach(function() {
      highscorePage = new HighscorePage(utils);
    });

    it('should call markOnlineLinks', function() {
      var called = false;
      var UtilsStub = function() {};
      UtilsStub.prototype.markOnlineLinks = function(a, b) {
        called = true;
      };
      highscorePage.utils = new UtilsStub();
      called.should.equal(false);
      highscorePage.update({});
      called.should.equal(true);
    });

    it('should update Antica', function(done) {
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
            level: 426,
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
            if (name === 'Meendel') {
              meendel_found = true;
              TestUtils.rgbToHex(links[i].style.color).should.equal(utils.color.green);
            } else if (name === 'Linglifer') {
              linglifer_found = true;
              TestUtils.rgbToHex(links[i].style.color).should.equal(utils.color.green);
            } else {
              links[i].style.color.should.equal('');
            }
          }
        }
        meendel_found.should.equal(true);
        linglifer_found.should.equal(true);
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
