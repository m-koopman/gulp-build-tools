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

    file_name = file_name.replace("..", ".");

    build.log( "reload", gutil.colors.cyan( file_name ), "changed, reloading page" );

    livereload.changed({
        body: {
            files: [file_name]
        }
    });
}

LiveReload.init =  function(paths) {
    livereload = tinylr( );
    livereload.listen( 35729 );

    gulp.watch( paths, notifyLiveReload );
}

module.exports = LiveReload;

