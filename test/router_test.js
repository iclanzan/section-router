'use strict';

var path = require('path');
var grunt = require('grunt');
var _ = grunt.util._;
var root = grunt.section;

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.section = {
  'File Structure': function (test) {
    test.expect(1);

    var output = [];
    grunt.file.recurse('tmp/output', function (abs, root, subdir, file) {
      output.push(path.join(subdir || '', file));
    });
    output.sort();

    var expected = [];
    grunt.file.recurse('test/expected', function (abs, root, subdir, file) {
      expected.push(path.join(subdir || '', file));
    });
    expected.sort();

    test.deepEqual(output, expected, 'Expected different file structure.');

    test.done();
  },

  'Order': function (test) {
    test.expect(8);

    var order = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth'];

    var childrenNames = root.children.map(function (c) { return c.name; }).join(', ');
    test.equal(childrenNames, 'with-index, dir, date, about, order, yadda', 'Expected a different ordering of the root’s children.');

    var orderPage = _.find(root.children, function (c) { return c.name == 'order'; });
    orderPage.children.forEach(function (child, index) {
      test.equal(child.name, order[index], 'Expected "' + child.name + '" to be the ' + order[index] + ' file.');
    });

    var pagesOrder = root.pages.map(function (c) { return c.name; }).join(', ');
    var expectedOrder = 'with-index, dir, first, second, third, my-article, date, fourth, , about, fifth, order, sixth, subdir, yadda';
    test.equal(pagesOrder, expectedOrder, 'Expected a different ordering of pages.');

    test.done();
  },

  'Date': function (test) {
    test.expect(3);

    var datePage = _.find(root.children, function (c) { return c.name == 'date'; });
    test.equal(datePage.timestamp, 1381363200000, 'Expected a different timestamp.');
    test.equal(datePage.date(), 'October 10, 2013', 'Expected a corresponding date string.');

    var dirPage = _.find(root.children, function (c) { return c.name == 'dir'; });
    test.ok(!dirPage.timestamp, 'Did not expect “dir” page to have an associated timestamp.');

    test.done();
  },

  'Files': function (test) {
    test.expect(3);

    test.equal(root.files.length, 1, 'Expected root to have a file not processed as content.');

    var yaddaPage = _.find(root.children, function (c) { return c.name == 'yadda'; });
    test.equal(yaddaPage.files.length, 1, 'Expected “yadda” to have a file not processed as content.');

    var orderPage = _.find(root.children, function (c) { return c.name == 'order'; });
    test.ok(!orderPage.files.length, 'Expected “order” to not have file not processed as content.');

    test.done();
  },

  'URL': function (test) {
    test.expect(4);

    test.equal(root.rel, '/', 'Expected a different base relative URL.');
    test.equal(root.url, 'http://example.com/', 'Expected a different base URL.');

    var datePage = _.find(root.children, function (c) { return c.name == 'date'; });
    test.equal(datePage.rel, '/date.html', 'Expected a different relative URL.');
    test.equal(datePage.url, 'http://example.com/date.html', 'Expected a different URL.');

    test.done();
  }
};
