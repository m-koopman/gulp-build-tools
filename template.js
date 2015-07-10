"use strict";

var build = require("./build.js");

var gulp = require("gulp"),
    gutil = require("gulp-util");

try {
    var jade = require("gulp-jade");
} catch(err) {
    var jade = false;
}

var Template = {};

Template.jade = function(src_globs, dest_folder, label) {
    if (!jade) {
        console.error("gulp-jade is not installed");
        return;
    }

    label = label || build.globsToString(src_globs);

    var jadeComplete = function() {
        build.log( " jade ",
            gutil.colors.cyan( label ),
            "compiled, copied to",
            gutil.colors.cyan( dest_folder ) );
    };

    gulp.src( src_globs )
        .pipe(jade({
            pretty: true
        }))
        .pipe( gulp.dest( dest_folder ).on("finish", jadeComplete) );
};

module.exports = Template;
