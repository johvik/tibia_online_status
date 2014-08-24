var fs = require('fs');
var should = require('should');
var jsdom = require('jsdom').jsdom;
require('jsdom').defaultDocumentFeatures = {
  FetchExternalResources: false,
  ProcessExternalResources: false
};

var Utils = require('../src/utils.js').Utils;

var GuildPage = require('../src/guild_page.js').GuildPage;

describe('GuildPage', function() {
  var utils = new Utils();
  var guildPage = new GuildPage(utils);

  describe('#parse', function() {
    this.timeout(5000);

    afterEach(function() {
      guildPage = new GuildPage(utils);
    });

    it('should not find guilds div', function(done) {
      global.document = jsdom('');
      guildPage.parse(function(err) {
        err.should.equal('Guilds div not found');
        guildPage.elements.should.eql({});
        done();
      });
    });

    it('should not find world', function(done) {
      global.document = jsdom('<div id="guilds"></div>');
      guildPage.parse(function(err) {
        err.should.equal('No world found');
        guildPage.elements.should.have.keys('guilds_div');
        done();
      });
    });

    it('should parse Red Rose', function(done) {
      var data = fs.readFileSync(__dirname + '/files/guild_page_red_rose.html', 'utf8');
      global.document = jsdom(data);
      guildPage.parse(function(err) {
        should.not.exist(err);
        guildPage.world.should.equal('Antica');
        guildPage.elements.should.have.keys('guilds_div');
        done();
      });
    });
  });
});
