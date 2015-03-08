function TosPage(page) {
  'use strict';
  page.parse(function(err) {
    if (err) {
      TosPage.debug(err);
    } else {
      TosPage.debug(page.toString());
      chrome.runtime.sendMessage({
        query: 'world',
        world: page.world
      }, function(res) {
        if (res.error) {
          TosPage.debug(res.error);
        } else {
          TosPage.debug(res.players);
          page.update(res.players);
          TosPage.debug('Done');
        }
      });
    }
  });
}

/**
 * Prints message if debug output is set in the options.
 */
TosPage.debug = function(message) {
  'use strict';
  chrome.storage.sync.get({
    debugOutput: false
  }, function(items) {
    if (items.debugOutput) {
      console.log('Tibia Online Status:', message);
    }
  });
};
