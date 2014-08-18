var should = require('should');

var Utils = require('../src/utils.js').Utils;

describe('Utils', function() {
  var utils = new Utils();

  describe('#to_property_name', function() {
    it('should replace 160', function() {
      var str = 'Hello' + String.fromCharCode(160) + 'World!';
      var hello_world = 'Hello World!';

      str.should.not.equal(hello_world);
      utils.to_property_name(str).should.equal(hello_world);
    });
  });
});
