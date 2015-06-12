var build = require('./build.js');

var gulp = require('gulp'),
    gutil = require('gulp-util');

var imagemin = require('gulp-imagemin');

var Images = {};

Images.compress = function(src_globs, dest_folder, label) {

    var globs_string = String(src_globs);
    if (globs_string[ 0 ] == '[') {
        globs_string = globs_string.substring(1, globs_string.length - 1);
    }
    label = label || globs_string;

    compressComplete = function() {
        build.log( "images",
            gutil.colors.cyan( label ),
            "compressed, copied to",
            gutil.colors.cyan( dest_folder ) );
    }

    gulp.src( src_globs )
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            optimisationLevel: 4
        }))
        .pipe( gulp.dest( dest_folder ).on('finish', compressComplete) );

}

module.exports = Images;
