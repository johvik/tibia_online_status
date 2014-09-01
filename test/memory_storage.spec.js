var should = require('should');

var MemoryStorage = require('../src/common/memory_storage.js').MemoryStorage;

describe('MemoryStorage', function() {
  var memoryStorage = new MemoryStorage();

  describe('#get', function() {
    it('should get empty', function() {
      should.not.exist(memoryStorage.get('abc'));
      memoryStorage.data.should.eql({});
    });

    it('should get abc', function() {
      memoryStorage.set('abc', 'ABC');
      memoryStorage.get('abc').should.equal('ABC');
      memoryStorage.data.should.eql({
        abc: 'ABC'
      });
    });
  });

  describe('#set', function() {
    beforeEach(function() {
      memoryStorage = new MemoryStorage();
    });

    it('should set abc', function() {
      memoryStorage.set('abc', 'ABC');
      memoryStorage.get('abc').should.equal('ABC');
      memoryStorage.data.should.eql({
        abc: 'ABC'
      });
    });

    it('should update abc', function() {
      memoryStorage.set('abc', 'ABC');
      memoryStorage.get('abc').should.equal('ABC');
      memoryStorage.data.should.eql({
        abc: 'ABC'
      });
      // Set a new value
      memoryStorage.set('abc', 'something else');
      memoryStorage.get('abc').should.equal('something else');
      memoryStorage.data.should.eql({
        abc: 'something else'
      });
    });
  });
});
