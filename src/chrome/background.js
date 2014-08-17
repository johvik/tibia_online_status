// TODO Remove dependency to jQuery... $.parseHTML("<img src='z' onerror='alert(\"hi there\")'>")
// TODO Add for guild page?
var worldPage = new WorldPage(XMLHttpRequest);

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
