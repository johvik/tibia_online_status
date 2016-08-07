function save_options() {
  'use strict';
  var debugOutput = document.getElementById('debugOutput').checked;
  var storage = chrome.storage.sync || chrome.storage.local;
  storage.set({
    debugOutput: debugOutput
  });
}

function restore_options() {
  'use strict';
  var storage = chrome.storage.sync || chrome.storage.local;
  storage.get({
    debugOutput: false
  }, function(items) {
    document.getElementById('debugOutput').checked = items.debugOutput;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('debugOutput').addEventListener('click', save_options);
