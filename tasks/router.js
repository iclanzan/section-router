/*
 * section-router
 * https://github.com/iclanzan/section-router
 *
 * Copyright (c) 2013 Sorin Iclanzan
 * Licensed under the MIT license.
 */

'use strict';

// Node modules
var path = require('path');
var url = require('url');

module.exports = function (grunt) {

  // Aliases
  var evt = grunt.event;
  var slugify = grunt.util._.slugify;
  var readFile = grunt.file.read;

  var dateFormat = grunt.template.date;
  dateFormat.masks['default'] = 'mmmm d, yyyy';
  function date(format) {
    return dateFormat(this.timestamp, format, true);
  }

  var dateRegex, indexRegex, contentExtensions;

  evt.on(['section', 'init'], function (options) {
    var proto = options.pagePrototype;
    proto.name = '';
    proto.url = '';
    proto.isIndex = true;

    dateRegex = options.dateRegex && new RegExp(options.dateRegex) || /^\d{4}-\d\d-\d\d-/;
    indexRegex = options.indexRegex && new RegExp(options.indexRegex) || /^\d+-/;
    contentExtensions = options.contentExtensions || [];
  });

  function router(file, node) {
    var isFile = file.stat.isFile();
    if (isFile && !~contentExtensions.indexOf(file.ext)) {
      evt.emit(['section', 'regularFile', file.ext], file, node);
      return;
    }

    // At this point we can stop the file from being added to the array of files to be copied.
    file.discard = true;

    if (isFile && file.name != 'index') {
      node = node.addChild({isIndex: false});
    }

    if (!isFile || file.name != 'index') {
      node.name = slugify(file.name.replace(dateRegex, function (match) {
        node.timestamp = new Date(match.slice(0, -1)).getTime();
        node.date = date;
        return '';
      }).replace(indexRegex, function (match) {
        node.index = parseInt(match, 10);
        return '';
      }));
    }

    if (isFile) {
      node.src = file.src;
      node.body = readFile(node.src);
      evt.emit(['section', 'contentFile', file.ext], file, node);
    }
  }

  evt.on(['section', 'file'], router);
  evt.on(['section', 'directory'], router);

  evt.on(['section', 'tree'], function buildPaths(node) {
    node.rel = node.parent && path.join(node.parent.rel, node.name) || '';

    if (node.src) {
      node.rel += node.isIndex ? '/' : '.html';
      node.url = url.resolve(node.options.baseURL || '', node.rel);
      node.dest = path.join(node.options.dest, node.rel, node.isIndex ? 'index.html' : '');
    }

    node.files.forEach(function (file) {
      file.rel = path.join(node.rel, file.name + '.' + file.ext);
      file.dest = path.join(node.options.dest, file.rel);
    });

    node.children.forEach(buildPaths);
  });

  // We want sort by index (lower index first),
  // followed by date (most recent first),
  // and finishing with an alphabetical name sort.
  function comparator(a, b) {
    var aHasIndex = a.hasOwnProperty('index'),
        bHasIndex = b.hasOwnProperty('index');

    if (aHasIndex) {
      if (bHasIndex) {
        return a.index - b.index;
      }
      return -1;
    }

    if (bHasIndex) {
      return 1;
    }

    var aHasTimestamp = a.hasOwnProperty('timestamp'),
        bHasTimestamp = b.hasOwnProperty('timestamp');

    if (aHasTimestamp) {
      if (bHasTimestamp) {
        return b.timestamp - a.timestamp;
      }
      return -1;
    }

    if (bHasTimestamp) {
      return 1;
    }

    return a.name > b.name ? 1 : -1;
  }

  evt.on(['section', 'tree'], function recurse(root) {
    root.children.sort(comparator).forEach(recurse);
  });

  evt.on(['section', 'tree'], function (root) {
    console.log(root.pages.map(function (c) { return c.name || 'U'; }));
    root.pages.sort(comparator);
    console.log(root.pages.map(function (c) { return c.name || 'U'; }));
  });
};
