var should = require('should');

var MemoryStorage = require('../src/common/memory_storage.js').MemoryStorage;

describe('MemoryStorage', function() {
  var memoryStorage = new MemoryStorage();

  describe('#get', function() {
    it('should get empty', function(done) {
      memoryStorage.get('abc', function(value) {
        should.not.exist(value);
        memoryStorage.data.should.eql({});
        done();
      });
    });

    it('should get abc', function(done) {
      memoryStorage.set('abc', 'ABC');
      memoryStorage.get('abc', function(value) {
        value.should.equal('ABC');
        memoryStorage.data.should.eql({
          abc: 'ABC'
        });
        done();
      });
    });
  });

  describe('#set', function() {
    beforeEach(function() {
      memoryStorage = new MemoryStorage();
    });

    it('should set abc', function(done) {
      memoryStorage.set('abc', 'ABC');
      memoryStorage.get('abc', function(value) {
        value.should.equal('ABC');
        memoryStorage.data.should.eql({
          abc: 'ABC'
        });
        done();
      });
    });

    it('should update abc', function(done) {
      memoryStorage.set('abc', 'ABC');
      memoryStorage.get('abc', function(value) {
        value.should.equal('ABC');
        memoryStorage.data.should.eql({
          abc: 'ABC'
        });
        // Set a new value
        memoryStorage.set('abc', 'something else');
        memoryStorage.get('abc', function(value) {
          value.should.equal('something else');
          memoryStorage.data.should.eql({
            abc: 'something else'
          });
          done();
        });
      });
    });
  });
});
