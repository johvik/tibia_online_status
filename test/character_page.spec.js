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

var CharacterPage = require('../src/common/character_page.js').CharacterPage;

describe('CharacterPage', function() {
  var utils = new Utils(XMLHttpRequest);
  var characterPage = new CharacterPage(utils);

  describe('#parse', function() {
    beforeEach(function() {
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

    it('should not parse character information', function(done) {
      global.document = jsdom('<div id="characters"><table><tr><td>Character Information</td></tr></table></div>');
      characterPage.parse(function(err) {
        err.should.startWith('Failed to parse character information. ');
        characterPage.elements.should.have.keys('characters_div');
        done();
      });
    });

    it('should parse Chorizo\'korv', function(done) {
      var data = fs.readFileSync(__dirname + '/files/character_page_chorizo_korv.html', 'utf8');
      global.document = jsdom(data);
      characterPage.parse(function(err) {
        should.not.exist(err);
        characterPage.must_be_online.should.equal(false);
        characterPage.must_be_offline.should.equal(false);
        characterPage.name.should.equal('Chorizo\'korv');
        characterPage.vocation.should.equal('Master Sorcerer');
        characterPage.level.should.equal(69);
        characterPage.world.should.equal('Inferna');
        characterPage.elements.should.have.keys('characters_div', 'name_column', 'vocation_column', 'level_column');
        done();
      });
    });

    it('should parse Ratsafari Guide', function(done) {
      var data = fs.readFileSync(__dirname + '/files/character_page_ratsafari_guide.html', 'utf8');
      global.document = jsdom(data);
      characterPage.parse(function(err) {
        should.not.exist(err);
        characterPage.must_be_online.should.equal(true);
        characterPage.must_be_offline.should.equal(false);
        characterPage.name.should.equal('Ratsafari Guide');
        characterPage.vocation.should.equal('Master Sorcerer');
        characterPage.level.should.equal(31);
        characterPage.world.should.equal('Inferna');
        characterPage.elements.should.have.keys('characters_div', 'name_column', 'vocation_column', 'level_column');
        done();
      });
    });

    it('should fetch and parse Chorizo\'korv', function(done) {
      this.timeout(5000);
      utils.fetch('http://www.tibia.com/community/?subtopic=characters&name=Chorizo%27korv', function(err, data) {
        should.not.exist(err);
        global.document = jsdom(data);
        characterPage.parse(function(err) {
          should.not.exist(err);
          characterPage.must_be_online.should.equal(false);
          characterPage.must_be_offline.should.equal(false);
          characterPage.name.should.equal('Chorizo\'korv');
          characterPage.vocation.should.equal('Master Sorcerer');
          characterPage.level.should.be.within(60, 140);
          characterPage.world.should.equal('Inferna');
          characterPage.elements.should.have.keys('characters_div', 'name_column', 'vocation_column', 'level_column');
          done();
        });
      });
    });
  });

  describe('#update', function() {
    beforeEach(function() {
      characterPage = new CharacterPage(utils);
    });

    it('should update Chorizo\'korv', function(done) {
      var data = fs.readFileSync(__dirname + '/files/character_page_chorizo_korv.html', 'utf8');
      global.document = jsdom(data);
      characterPage.parse(function(err) {
        should.not.exist(err);
        characterPage.must_be_online.should.equal(false);
        characterPage.must_be_offline.should.equal(false);
        characterPage.name.should.equal('Chorizo\'korv');
        characterPage.vocation.should.equal('Master Sorcerer');
        characterPage.level.should.equal(69);
        characterPage.world.should.equal('Inferna');
        characterPage.elements.should.have.keys('characters_div', 'name_column', 'vocation_column', 'level_column');

        characterPage.update({});
        characterPage.elements.name_column.style.color.should.equal('');
        characterPage.elements.level_column.textContent.should.equal('69');
        characterPage.elements.vocation_column.textContent.should.equal('Master Sorcerer');

        characterPage.update({
          'Chorizo\'korv': {
            level: 70,
            vocation: 'Sorcerer'
          }
        });
        TestUtils.rgbToHex(characterPage.elements.name_column.style.color).should.equal(utils.color.green);
        characterPage.elements.level_column.textContent.should.equal('70 (+1)');
        characterPage.elements.vocation_column.textContent.should.equal('Sorcerer');

        characterPage.update({
          'Chorizo\'korv': {
            level: 68,
            vocation: 'Master Sorcerer'
          }
        });
        TestUtils.rgbToHex(characterPage.elements.name_column.style.color).should.equal(utils.color.green);
        characterPage.elements.level_column.textContent.should.equal('68 (-1)');
        characterPage.elements.vocation_column.textContent.should.equal('Master Sorcerer');
        done();
      });
    });

    it('should update Ratsafari Guide', function(done) {
      var data = fs.readFileSync(__dirname + '/files/character_page_ratsafari_guide.html', 'utf8');
      global.document = jsdom(data);
      characterPage.parse(function(err) {
        should.not.exist(err);
        characterPage.must_be_online.should.equal(true);
        characterPage.must_be_offline.should.equal(false);
        characterPage.name.should.equal('Ratsafari Guide');
        characterPage.vocation.should.equal('Master Sorcerer');
        characterPage.level.should.equal(31);
        characterPage.world.should.equal('Inferna');
        characterPage.elements.should.have.keys('characters_div', 'name_column', 'vocation_column', 'level_column');

        characterPage.update({});
        TestUtils.rgbToHex(characterPage.elements.name_column.style.color).should.equal(utils.color.green);
        characterPage.elements.level_column.textContent.should.equal('31');
        characterPage.elements.vocation_column.textContent.should.equal('Master Sorcerer');
        done();
      });
    });
  });
});
