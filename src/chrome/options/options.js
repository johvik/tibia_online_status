function save_options() {
  var debugOutput = document.getElementById('debugOutput').checked;
  chrome.storage.sync.set({
    debugOutput: debugOutput
  });
}

function restore_options() {
  chrome.storage.sync.get({
    debugOutput: false
  }, function(items) {
    document.getElementById('debugOutput').checked = items.debugOutput;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('debugOutput').addEventListener('click', save_options);
