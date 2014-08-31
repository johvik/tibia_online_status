var fs = require('fs');
var should = require('should');
var jsdom = require('jsdom').jsdom;
require('jsdom').defaultDocumentFeatures = {
  FetchExternalResources: false,
  ProcessExternalResources: false
};

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

    it('should parse Aurera', function(done) {
      var data = fs.readFileSync(__dirname + '/files/highscore_page_aurera.html', 'utf8');
      global.document = jsdom(data);
      highscorePage.parse(function(err) {
        should.not.exist(err);
        highscorePage.world.should.equal('Aurera');
        highscorePage.elements.should.have.keys('highscores_div');
        done();
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
  });
});
