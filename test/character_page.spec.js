var fs = require('fs');
var should = require('should');
var jsdom = require('jsdom').jsdom;
require("jsdom").defaultDocumentFeatures = {
  FetchExternalResources: false,
  ProcessExternalResources: false
};

var Utils = require('../src/utils.js').Utils;

var CharacterPage = require('../src/character_page.js').CharacterPage;

describe('CharacterPage', function() {
  var utils = new Utils();
  var characterPage = new CharacterPage(utils);

  describe('#parse', function() {
    this.timeout(5000);

    afterEach(function() {
      characterPage = new CharacterPage(utils);
    });

    it('should not find characters div', function(done) {
      global.document = jsdom('');
      characterPage.parse(function(err) {
        err.should.equal('Characters div not found');
        characterPage.elements.should.eql({});
        done();
      });
    });

    it('should not find character information', function(done) {
      global.document = jsdom('<div id="characters"></div>');
      characterPage.parse(function(err) {
        err.should.equal('No character information found');
        characterPage.elements.should.have.keys('characters_div');
        done();
      });
    });

    it('should parse Chorizo\'korv', function(done) {
      var data = fs.readFileSync(__dirname + '/files/character_page_chorizo_korv.html', 'utf8');
      global.document = jsdom(data);
      characterPage.parse(function(err) {
        should.not.exist(err);
        characterPage.name.should.equal('Chorizo\'korv');
        characterPage.vocation.should.equal('Master Sorcerer');
        characterPage.level.should.equal(69);
        characterPage.world.should.equal('Inferna');
        characterPage.elements.should.have.keys('characters_div', 'name_column', 'vocation_column', 'level_column');
        done();
      });
    });
  });
});
