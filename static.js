var build = require('./build.js');

var gulp = require('gulp'),
    gutil = require('gulp-util');

var Static = {};

Static.copy = function(src_globs, dest_folder, label) {
    label = label || build.globsToString(src_globs);

    copyComplete = function() {
        build.log( "static",
            gutil.colors.cyan( label ),
            "copied to",
            gutil.colors.cyan( dest_folder ) );
    }

    gulp.src( src_globs )
        .pipe( gulp.dest( dest_folder ).on('finish', copyComplete) );
}

module.exports = Static;
