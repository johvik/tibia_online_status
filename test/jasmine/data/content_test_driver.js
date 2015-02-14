var completeCallback = null;

function onExecuteComplete(success, text) {
  // This function is called from console_boot.js
  if (completeCallback) {
    completeCallback({
      success: success,
      text: text
    });
    completeCallback = null;
  }
}

function pickCharacters(callback) {
  // Pick the first online/offline characters if any
  var links = document.getElementsByTagName('a');
  var link_exp = /https:\/\/secure\.tibia\.com\/community\/\?subtopic=characters&name=.+/;
  var res = {};
  for (var i = 0, j = links.length; i < j; i++) {
    if (link_exp.test(links[i].href)) {
      if (links[i].style && links[i].style.color) {
        if (!res.online) {
          res.online = links[i].href;
        }
      } else {
        if (!res.offline) {
          res.offline = links[i].href;
        }
      }

      if (res.online && res.offline) {
        // Both found
        break;
      }
    }
  }
  return callback(res);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'execute') {
    completeCallback = sendResponse;
    setTimeout(function() {
      jasmine.getEnv().execute();
    }, 500); // Give it some time before testing
    return true; // Async callback
  } else if (request.type === 'pickCharacters') {
    return pickCharacters(sendResponse);
  }
});
