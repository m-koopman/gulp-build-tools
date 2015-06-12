var build = require('./build.js');

var gulp = require('gulp'),
    gutil = require('gulp-util');

var jade = require('gulp-jade');

var Template = {};

Template.jade = function(src_globs, dest_folder, label) {
    label = label || build.globsToString(src_globs);

    jadeComplete = function() {
        build.log( " jade ",
            gutil.colors.cyan( label ),
            "compiled, copied to",
            gutil.colors.cyan( dest_folder ) );
    }

    gulp.src( src_globs )
        .pipe(jade({
            pretty: true
        }))
        .pipe( gulp.dest( dest_folder ).on('finish', jadeComplete) );
}

module.exports = Template;
