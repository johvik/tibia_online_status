Tibia Online Status
===================
[![Build Status](https://travis-ci.org/johvik/tibia_online_status.svg)](https://travis-ci.org/johvik/tibia_online_status)
[![Dependency Status](https://gemnasium.com/johvik/tibia_online_status.svg)](https://gemnasium.com/johvik/tibia_online_status)
[![Coverage Status](https://img.shields.io/coveralls/johvik/tibia_online_status.svg)](https://coveralls.io/r/johvik/tibia_online_status)

This extension adds additional status information to the characters page and the guilds page, for the game Tibia.

To build run `npm install` followed by `grunt`.
The chrome extension will be packed in `dest/chrome.zip`.
For the firefox addon run `grunt shell:xpi` and look inside `dest/firefox`.

To execute end-to-end tests for chrome load the extension from `test/jasmin/` (requires that the main extension is loaded first). Then click on the jasmine icon in the browser to start the test.
