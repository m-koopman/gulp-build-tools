var build = require('./build.js');

var gulp = require('gulp'),
    gutil = require('gulp-util');

var babelify = require("babelify"),
    uglify = require("gulp-uglify");

var sourcemaps = require('gulp-sourcemaps'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename');

function handleBrowserifyErrors(e) {
    var error = Array.prototype.slice.call( arguments )[ 0 ];

    if ( error._babel ) {
        error.source = "babel ";

        var filename = error.filename.split('/').slice(-1)[0];

        var summary = "Error at " + gutil.colors.green( error.loc.line + ":" + error.loc.column ) + " of " + gutil.colors.cyan( filename );

        build.error( error.source + " build failed.", gutil.colors.stripColor( summary ) );

        var message = error.message;
        message = message.substring( message.indexOf( ":" ) + 2, message.length );
        build.log( "!" + error.source, summary );
        build.log( message );
    } else {
        build.error( "Browserify build failed", error.message );
        build.log( "!bundle", error.message );
    }

    this.emit('end');
}

var Bundle = {};

Bundle.bundle = function(options) {

    if ( options.entries === undefined ) {
        return false;
    }
    if ( options.dest_folder === undefined ) {
        return false;
    }

    options.paths = options.paths || "./";
    options.debug = options.debug || false;

    options.dest_filename = options.dest_filename || "app.js";
    options.compress = options.compress || false;
    options.babel = options.babel || false;
    options.watch = options.watch || false;

    options.reference_dependencies = options.reference_dependencies || false;
    options.include_dependencies = options.include_dependencies || false;

    var bundler = browserify({
        entries: options.entries,
        paths: options.paths,
        debug: options.debug,

        // For watchify...
        cache: {},
        packageCache: {},
        fullPaths: true
    });

    if ( options.reference_dependencies ) {
        for ( var i = 0; i < options.reference_dependencies.length; i++ ) {
            bundler.external( options.reference_dependencies[ i ] );
        }
    }

    if ( options.include_dependencies ) {
        for ( var i = 0; i < options.include_dependencies.length; i++ ) {
            bundler.require( options.include_dependencies[ i ] );
        }
    }

    if ( options.babel === true ) {
        bundler.transform( babelify );
    }

    bundler.on('time', function(time) {
        build.log( "scripts",
            gutil.colors.cyan( options.dest_folder + options.dest_filename ),
            "built in",
            gutil.colors.magenta( time + "ms" ) );
    });

    var bundle = function() {
        return bundler
            .bundle( )
            .on( 'error', handleBrowserifyErrors )
            .pipe( source( options.dest_filename ) )
            .pipe( buffer( ) )
            .pipe( sourcemaps.init( { loadMaps: true } ) )

                .pipe( options.compress ? uglify() : gutil.noop() )
                .pipe( rename( options.dest_filename ) )
                .pipe( gulp.dest( options.dest_folder ) )

            // Pipe out the sourcemaps
            .pipe( sourcemaps.write( "./" ) )
            .pipe( gulp.dest( options.dest_folder ) );
    };

    if (options.watch) {
        bundler = watchify( bundler );
        bundler.on('update', bundle);
    } else {
        build.log( "scripts",
            gutil.colors.cyan( options.dest_folder + options.dest_filename ), "building statically" );
    }

    return bundle();
};


module.exports = Bundle;
