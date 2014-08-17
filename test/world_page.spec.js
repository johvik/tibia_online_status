var should = require('should');

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var WorldPage = require('../src/world_page.js').WorldPage;

describe('WorldPage', function() {
  describe('#fetch', function() {
    it('should fetch Antica', function(done) {
      this.timeout(5000);
      var worldPage = new WorldPage(XMLHttpRequest);
      worldPage.fetch('Antica', function(err, data) {
        should.exist(data);
        data.should.match(/Antica/);
        should.not.exist(err);
        done();
      });
    });
  });
});
