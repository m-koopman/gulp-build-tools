var build = require('./build.js');

var gulp = require('gulp'),
    gutil = require('gulp-util');

var tinylr = require('tiny-lr');

var livereload;

LiveReload = {};

function notifyLiveReload(event) {
    if ( !livereload ) {
        return;
    }

    var file_name = require('path').relative(__dirname, event.path);

    file_name = file_name.replace(/\.\.\//g, "");

    build.log( "reload", gutil.colors.cyan( file_name ), "changed, reloading page" );

    livereload.changed({
        body: {
            files: [file_name]
        }
    });
}

LiveReload.init =  function(paths, port) {
    port = port || 35729;
    livereload = tinylr( );
    livereload.listen( port );

    gulp.watch( paths, notifyLiveReload );
}

module.exports = LiveReload;

