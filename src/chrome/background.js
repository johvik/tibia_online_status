// TODO Add for guild page?
var utils = new Utils();
var worldPage = new WorldPage(utils);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.query === 'world') {
    worldPage.query(request.world, function(err, res) {
      if (err) {
        return sendResponse({
          error: err
        });
      }
      return sendResponse({
        players: res
      });
    });
    return true;
  } else {
    return sendResponse({
      error: 'Bad query ' + request.query
    });
  }
});
