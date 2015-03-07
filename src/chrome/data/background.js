var worldPage = new WorldPage(new Utils());

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
  }
  return sendResponse({
    error: 'Bad query ' + request.query
  });
});
