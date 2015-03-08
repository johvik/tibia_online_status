/* More or less a copy of original boot.js but does not use onload/html */
(function() {
  'use strict';
  window.jasmine = jasmineRequire.core(jasmineRequire);

  jasmineRequire.console(jasmineRequire, jasmine);
  var env = jasmine.getEnv();
  var jasmineInterface = jasmineRequire.interface(jasmine, env);
  if (typeof window == "undefined" && typeof exports == "object") {
    extend(exports, jasmineInterface);
  } else {
    extend(window, jasmineInterface);
  }

  // Modified version of ConsoleReporter
  function TextReporter(options) {
    var text = '';
    var print = function(str) {
      text += str;
    };
    var onComplete = options.onComplete || function() {};
    var specCount,
      failureCount,
      failedSpecs = [],
      pendingCount;

    this.jasmineStarted = function() {
      specCount = 0;
      failureCount = 0;
      pendingCount = 0;
      print('Started');
      printNewline();
    };

    this.jasmineDone = function() {
      printNewline();
      for (var i = 0; i < failedSpecs.length; i++) {
        specFailureDetails(failedSpecs[i]);
      }

      if (specCount > 0) {
        printNewline();

        var specCounts = specCount + ' ' + plural('spec', specCount) + ', ' +
          failureCount + ' ' + plural('failure', failureCount);

        if (pendingCount) {
          specCounts += ', ' + pendingCount + ' pending ' + plural('spec', pendingCount);
        }

        print(specCounts);
      } else {
        print('No specs found');
      }
      printNewline();

      onComplete(failureCount === 0, text);
    };

    this.specDone = function(result) {
      specCount++;

      if (result.status == 'pending') {
        pendingCount++;
        print(colored('yellow', '*'));
        return;
      }

      if (result.status == 'passed') {
        print(colored('green', '.'));
        return;
      }

      if (result.status == 'failed') {
        failureCount++;
        failedSpecs.push(result);
        print(colored('red', 'F'));
      }
    };

    return this;

    function printNewline() {
      print('\n');
    }

    function colored(color, str) {
      return str;
    }

    function plural(str, count) {
      return count == 1 ? str : str + 's';
    }

    function repeat(thing, times) {
      var arr = [];
      for (var i = 0; i < times; i++) {
        arr.push(thing);
      }
      return arr;
    }

    function indent(str, spaces) {
      var lines = (str || '').split('\n');
      var newArr = [];
      for (var i = 0; i < lines.length; i++) {
        newArr.push(repeat(' ', spaces).join('') + lines[i]);
      }
      return newArr.join('\n');
    }

    function specFailureDetails(result) {
      printNewline();
      print(result.fullName);

      for (var i = 0; i < result.failedExpectations.length; i++) {
        var failedExpectation = result.failedExpectations[i];
        printNewline();
        print(indent(failedExpectation.message, 2));
        print(indent(failedExpectation.stack, 2));
      }

      printNewline();
    }
  }

  env.addReporter(new TextReporter({
    onComplete: onExecuteComplete
  }));
  window.setTimeout = window.setTimeout;
  window.setInterval = window.setInterval;
  window.clearTimeout = window.clearTimeout;
  window.clearInterval = window.clearInterval;

  function extend(destination, source) {
    for (var property in source) destination[property] = source[property];
    return destination;
  }
}());
