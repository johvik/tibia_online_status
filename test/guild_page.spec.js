var fs = require('fs');
var should = require('should');
var jsdom = require('jsdom').jsdom;
require('jsdom').defaultDocumentFeatures = {
  FetchExternalResources: false,
  ProcessExternalResources: false
};

global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Utils = require('../src/common/utils.js').Utils;

var GuildPage = require('../src/common/guild_page.js').GuildPage;

describe('GuildPage', function() {
  var utils = new Utils();
  var guildPage = new GuildPage(utils);

  describe('#parse', function() {
    beforeEach(function() {
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

    it('should parse Satori', function(done) {
      var data = fs.readFileSync(__dirname + '/files/guild_page_satori.html', 'utf8');
      global.document = jsdom(data);
      guildPage.parse(function(err) {
        should.not.exist(err);
        guildPage.world.should.equal('Antica');
        guildPage.elements.should.have.keys('guilds_div');
        done();
      });
    });

    it('should fetch and parse Red Rose', function(done) {
      this.timeout(5000);
      utils.fetch('http://www.tibia.com/community/?subtopic=guilds&page=view&GuildName=Red+Rose', function(err, data) {
        should.not.exist(err);
        global.document = jsdom(data);
        guildPage.parse(function(err) {
          should.not.exist(err);
          guildPage.world.should.equal('Antica');
          guildPage.elements.should.have.keys('guilds_div');
          done();
        });
      });
    });

    it('should fetch and parse Satori secure', function(done) {
      this.timeout(5000);
      utils.fetch('https://secure.tibia.com/community/?subtopic=guilds&page=view&GuildName=Satori', function(err, data) {
        should.not.exist(err);
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

  describe('#update', function() {
    beforeEach(function() {
      guildPage = new GuildPage(utils);
    });

    it('should update Bongos', function(done) {
      var data = fs.readFileSync(__dirname + '/files/guild_page_bongos.html', 'utf8');
      global.document = jsdom(data);
      guildPage.parse(function(err) {
        should.not.exist(err);
        guildPage.world.should.equal('Morta');
        guildPage.elements.should.have.keys('guilds_div');

        // Update with one marked online, one marked offline
        // and one invited as online
        guildPage.update({
          'Plozy Sanki': {
            level: 198,
            vocation: 'Elder Druid'
          },
          'Haraverick': {
            level: 100,
            vocation: 'Master Sorcerer'
          },
          'Babin Xariusano': {
            level: 1,
            vocation: 'None'
          }
        });
        var plozy_sanki_found = false;
        var haraverick_found = false;
        var babin_xariusano_found = false;
        var links = guildPage.elements.guilds_div.getElementsByTagName('a');
        var link_exp = /https:\/\/secure\.tibia\.com\/community\/\?subtopic=characters&name=.+/;
        for (var i = 0, j = links.length; i < j; i++) {
          if (link_exp.test(links[i].href)) {
            var name = utils.decode(links[i].innerHTML);
            var row = links[i].parentElement.parentElement.getElementsByTagName('td');
            var level_column = row[3];
            if (name === 'Plozy Sanki') {
              plozy_sanki_found = true;
              level_column.textContent.should.equal('198 (+100)');
            } else if (name === 'Haraverick') {
              haraverick_found = true;
              level_column.textContent.should.equal('32');
            } else if (name === 'Babin Xariusano') {
              babin_xariusano_found = true;
            } else if (row.length >= 6) {
              level_column.textContent.should.equal('' + parseInt(level_column.textContent, 10));
            }
          }
        }
        plozy_sanki_found.should.equal(true);
        haraverick_found.should.equal(true);
        babin_xariusano_found.should.equal(true);
        done();
      });
    });
  });

  describe('#toString', function() {
    beforeEach(function() {
      guildPage = new GuildPage(utils);
    });

    it('should have keys', function() {
      var str = guildPage.toString();
      str.should.have.keys('world', 'elements');
    });
  });
});
