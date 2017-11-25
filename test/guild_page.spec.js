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

global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Utils = require('../src/utils.js').Utils;

var GuildPage = require('../src/guild_page.js').GuildPage;

describe('GuildPage', function() {
  'use strict';
  var utils = new Utils();
  var guildPage = new GuildPage(utils);

  describe('#parse', function() {
    beforeEach(function() {
      guildPage = new GuildPage(utils);
    });

    it('should not find guilds div', function(done) {
      global.document = new JSDOM('').window.document;
      guildPage.parse(function(err) {
        err.should.equal('Guilds div not found');
        guildPage.elements.should.eql({});
        done();
      });
    });

    it('should not find world', function(done) {
      global.document = new JSDOM('<div id="guilds"></div>').window.document;
      guildPage.parse(function(err) {
        err.should.equal('No world found');
        guildPage.elements.should.have.keys('guilds_div');
        done();
      });
    });

    it('should parse Satori', function(done) {
      var data = fs.readFileSync(__dirname + '/files/guild_page_satori.html', 'utf8');
      global.document = new JSDOM(data).window.document;
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
        global.document = new JSDOM(data).window.document;
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
        global.document = new JSDOM(data).window.document;
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

    it('should update Old Fashion', function(done) {
      var data = fs.readFileSync(__dirname + '/files/guild_page_old_fashion.html', 'utf8');
      global.document = new JSDOM(data).window.document;
      guildPage.parse(function(err) {
        should.not.exist(err);
        guildPage.world.should.equal('Morta');
        guildPage.elements.should.have.keys('guilds_div');

        // Update with one marked online, one marked offline
        // and one invited as online
        guildPage.update({
          'Tironyte': {
            level: 100,
            vocation: 'Elder Druid'
          },
          'Martin Grower': {
            level: 42,
            vocation: 'Master Sorcerer'
          },
          'Mehland': {
            level: 250,
            vocation: 'None'
          }
        });
        var tironyte_found = false;
        var martin_grower_found = false;
        var mehland_found = false;
        var links = guildPage.elements.guilds_div.getElementsByTagName('a');
        var link_exp = /https:\/\/secure\.tibia\.com\/community\/\?subtopic=characters&name=.+/;
        for (var i = 0, j = links.length; i < j; i++) {
          if (link_exp.test(links[i].href)) {
            var name = utils.decode(links[i].innerHTML);
            var row = links[i].parentElement.parentElement.getElementsByTagName('td');
            var level_column = row[3];
            if (name === 'Tironyte') {
              tironyte_found = true;
              level_column.textContent.should.equal('100 (+21)');
            } else if (name === 'Martin Grower') {
              martin_grower_found = true;
              level_column.textContent.should.equal('47');
            } else if (name === 'Mehland') {
              mehland_found = true;
            } else if (row.length >= 6) {
              level_column.textContent.should.equal('' + parseInt(level_column.textContent, 10));
            }
          }
        }
        tironyte_found.should.equal(true);
        martin_grower_found.should.equal(true);
        mehland_found.should.equal(true);
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
