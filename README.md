section-router
==============

This is a plugin for [Section, a static site generator](http://section.iclanzan.com), that builds paths and URLs while also extracting dates and indexes from filenames.

## Getting Started
This plugin requires the `~0.1.0` version of the [grunt-section](https://github.com/iclanzan/grunt-section) plugin.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. You may install this plugin with this command:

```shell
npm install section-router --save
```

## Options
This plugin introduces a number of new options that can be set on the *grunt-section* configuration object inside the `Gruntfile.js` file. Here’s a simple example of how that file might look like:

```js
grunt.initConfig({
  section: {
    target: {
      options: {
        contentExtensions: ['md', 'markdown'],
        baseURL: 'http://example.com/',
        dateRegex: '^\d{4}-\d\d-\d\d-',
        indexRegex: '^\d+-'
      },
      src: 'input/directory/',
      dest: 'output/directory/'
    },
  },
});
```

### contentExtensions
type: `Array`
default: `[]`

An array of extensions dictating what files should be treated as content files. Content files are text files that have their bodies loaded into memory for transformation purposes and are later written to disk as `html` files.

### `baseURL`
type: `String`
default: `''`

Usually this is the root of your website, and will be used to determine the URL of each page/resource.

### `dateRegex`
type: `String`,
default: `'^\d{4}-\d\d-\d\d-'`

By default, for a file named something like `2013-09-25-name.md` the plugin extracts the date and removes it from the filename.

### `indexRegex`
type: `String`
default: `^\d+-`

The index of a file determines its position in listings such as menus. By default the plugin looks for files like `01-name.md`. In this specific case the file will have the `01-` removed and will take the first position in listings.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
### v0.1.0
Initial version
