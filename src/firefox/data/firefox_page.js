(function(page) {
  'use strict';
  /**
   * Prints message if debug output is set in the options.
   */
  var debug = function(message) {
    self.port.once('query:options', function(options) {
      if (options.debugOutput) {
        console.log('Tibia Online Status:', message);
      }
    });
    self.port.emit('query:options');
  };

  page.parse(function(err) {
    if (err) {
      debug(err);
    } else {
      debug(page.toString());
      self.port.once('query:world', function(res) {
        if (res.error) {
          debug(res.error);
        } else {
          debug(res.players);
          page.update(res.players);
          debug('Done');
        }
      });
      self.port.emit('query:world', page.world);
    }
  });
})
