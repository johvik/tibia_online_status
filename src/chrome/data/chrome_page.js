(function(page) {
  'use strict';
  /**
   * Prints message if debug output is set in the options.
   */
  var debug = function(message) {
    chrome.storage.sync.get({
      debugOutput: false
    }, function(items) {
      if (items.debugOutput) {
        console.log('Tibia Online Status:', message);
      }
    });
  };

  page.parse(function(err) {
    if (err) {
      debug(err);
    } else {
      debug(page.toString());
      chrome.runtime.sendMessage({
        query: 'world',
        world: page.world
      }, function(res) {
        if (res.error) {
          debug(res.error);
        } else {
          debug(res.players);
          page.update(res.players);
          debug('Done');
        }
      });
    }
  });
})
