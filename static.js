var build = require('./build.js');

var gulp = require('gulp'),
    gutil = require('gulp-util');

var Static = {};

Static.copy = function(src_globs, dest_folder, label) {
    var globs_string = String(src_globs);
    label = label || globs_string.substring(1, globs_string.length - 1);
    gulp.src( src_globs )
        .pipe( gulp.dest( dest_folder ) );

    build.log( "static",
            gutil.colors.cyan( label ),
            "copied to",
            gutil.colors.cyan( dest_folder ) );
}

module.exports = Static;
