function TosPage(page) {
  'use strict';
  page.parse(function(err) {
    if (err) {
      TosPage.debug(err);
    } else {
      TosPage.debug(page.toString());
      self.port.once('query:world', function(res) {
        if (res.error) {
          TosPage.debug(res.error);
        } else {
          TosPage.debug(res.players);
          page.update(res.players);
          TosPage.debug('Done');
        }
      });
      self.port.emit('query:world', page.world);
    }
  });
}

/**
 * Prints message if debug output is set in the options.
 */
TosPage.debug = function(message) {
  'use strict';
  self.port.once('query:options', function(options) {
    if (options.debugOutput) {
      console.log('Tibia Online Status:', message);
    }
  });
  self.port.emit('query:options');
};
