var gulp = require('gulp'),
    gutil = require('gulp-util'),
    dateformat = require('dateformat');

var notify = require('gulp-notify');

function getLogPrefix( str ) {
    var color = gutil.colors.yellow;
    if ( str[ 0 ] == '!' ) {
        str = str.substring( 1, str.length );
        color = gutil.colors.red;
    }
    return ( "[ " + color( str ) + " ]");
}

notify.logLevel(0);

Build = {};

Build.log = function() {
    var time = '['+gutil.colors.grey(dateformat(new Date(), 'HH:MM:ss'))+']';
    process.stdout.write(time + ' ');

    var args = Array.prototype.slice.call(arguments);
    if (args.length > 1) {
        process.stdout.write(getLogPrefix(args.shift()) + ' ');
    }
    console.log.apply(console, args);
}

Build.error = function(title, message) {
    gulp.src("")
        .pipe( notify({
            title: title,
            message: message
        }));
}

Build.globsToString = function(globArray) {
    var globs_string = String(globArray);
    if (globs_string[ 0 ] == '[') {
        globs_string = globs_string.substring(1, globs_string.length - 1);
    }

    return globs_string;
}

module.exports = Build;
