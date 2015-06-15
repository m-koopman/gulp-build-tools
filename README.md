# Gulp Build Tools

A suite of internal build tools for creating web applications with `gulp`.

## Build Instructions

The latest release of this module can be installed from `npm` with

`npm install gulp-build-tools`.

Alternatively, the latest build of this module can be installed directly from `GitHub` with

`npm install m-koopman/gulp-build-tools --save-dev`.

Due to the way that `npm` is structured, `GitHub` dependencies are cleanly installed after every update, which means reinstalling all of their dependencies. To minimise build time, installing tagged releases from `npm` directly is recommended.

## Modules

The tools are split into a number of modules, which can be required individually

```
var build = require("gulp-build-tools/build"),
    reload = require("gulp-build-tools/livereload"),
    scripts = require("gulp-build-tools/scripts"),
    static = require("gulp-build-tools/static"),
    style = require("gulp-build-tools/style"),
    template = require("gulp-build-tools/template");
```

 or as a bundle.

```
var gulp_tools = require("gulp-build-tools");

> gulp_tools.build
> gulp_tools.scripts
```

### Build.js

Generic methods used throughout the project.

**Build.log(..args)**

Logs a variable number of arguments, separated by a space and prefixed with the current time. If more than one argument is provided, the first is taken as an identifier and used to prefix the log. A prefix beginning with `!` will be printed in red with the `!` removed.

**Build.error(title, message)**

Alert the user of an error using the `notify` plugin, accepting a title for the notification and a body message. Notifications will be delivered natively on OSX, or using Growl if installed on Windows.

**Build.globsToString(globArray)**

Pretty print an array of globs for use in console logs. Converts the array to a string and removes the `[]`.

### Livereload.js

Handles the dispatching of live-reload events to watching browsers. Relies on `tiny-lr` to dispatch the events, and the client-side scripts must be injected manually. Will listen on the default live-reload port, `35729`, unless otherwise specified.

**Livereload.init(globs, [port])**

Starts a live-reload server on the specified `port`, which will issue a reload event when any file matching `globs` is modified.

### Scripts.js

Handles the compilation of script files within the project.

**Scripts.bundle(options)**

Compiles the source files into a single javascript bundle, as specified by the options. The options can be specified as follows.

- **options.paths** `List(String)` - A list of paths to explore when resolving `require` calls. Defaults to `"./"`.
- **options.debug** `Boolean` - Whether to build in `browserify` debug mode. Defaults to `false`.
- **options.entries** `List(String)` - List of entry points to the application. Required.
- **options.dest_folder** `String` - The folder to place the output file. Required.
- **options.dest_filename** `String` - The final filename of the bundle. Defaults to `"app.js"`.
- **options.compress** `Boolean` - Whether or not to minify the output bundle. Significantly reduces bundle size, but can increase build time. Defaults to `false`.
- **options.babel** `Boolean` - Whether or not to transpile the source from ES6 to ES5 using `Babel` before bundling. Defaults to `false`.
- **options.watch** `Boolean` - Whether or not to watch for changes in any referenced source files, and trigger rebuilds of the bundle. Defaults to `false`.
- **options.standalone** `String` - An optional name for the standalone bundle. Will not be exposed as standalone if no name is provided.
- **options.reference_dependies** `List(String)` - A list of dependencies to reference from within the bundle. Any dependency provided in this list will not be included in the bundle when referenced with a require. Defaults to none.
- **options.include_dependencies** `List(String)` - A list of dependencies to add to the bundle, regardless of whether they are referenced or not. Defaults to none.

### Static.js

Handles static files in the compilation phase. Currently supports static copying, but can be extended to support a range of static tasks.

**Static.copy(src_globs, dest_folder, [label])**

Takes any file matching `src_globs` and moves it to `dest_folder`. Relative paths within the source folder will be preserved.

An optional `label` parameter can be passed to specify the identifier to log on completion; if unspecified, a string representation of `src_globs` is used.

### Style.js

Supports compilation of style files to CSS. Currently supports SASS compilation.

**Style.sass(src_globs, dest_folder, options)**

Takes any file matching `src_globs` and compiles it to `CSS` using `SASS`, saving the compiled files to `dest_folder`.

The transformation can be customised using an options object, with the following entries.

- **options.autoprefix** `List(String)` - A list of browsers to support using `autoprefixer`, which will parse the `CSS` and add vendor prefixes where required. Can be passed an empty array or `false` to disable. Defaults to `false`.
- **options.entries** `List(String)` - The entry points to the `SASS` application, which will be compiled into their own output `CSS` file. If no entries are specified, all files matching `src_glob` will be compiled directly.
- **options.watch** `Boolean` - Whether or not to watch the `CSS` and recompile when any changes are detected. Defaults to `false`.
- **options.compress** `Boolean` - Whether or not to compress/minify the `CSS` output. Defaults to `false`.
- **options.sourcemaps** `Boolean` - Whether or not to generate source mapping for the `CSS` output. Sourcemaps will be appended to the `CSS` files and make it possible to debug from within the browser. Defaults to `false`.

### Template.js

Supports compilation of static layout templates to HTML. The only language currently supported is `Jade`

**Template.jade(src_globs, dest_folder, [label])**

Takes any file matching `src_globs` and compiles it to `Jade`, saving the compiled files to `dest_folder`.

An optional `label` parameter can be passed to specify the identifier to log on completion; if unspecified, a string representation of `src_globs` is used.

## License
```
The MIT License (MIT)

Copyright (c) 2015 Max Koopman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
