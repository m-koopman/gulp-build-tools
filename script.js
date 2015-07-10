"use strict";

var build = require("./build.js");

var gulp = require("gulp"),
    gutil = require("gulp-util");

try {
    var uglify = require("gulp-uglify");
} catch(err) {
    var uglify = false;
}

try {
    var sourcemaps = require("gulp-sourcemaps");
} catch(err) {
    var sourcemaps = false;
}

try {
    var watchify = require("watchify");
} catch(err) {
    var watchify = false;
}

try {
    var browserify = require("browserify");
} catch(err) {
    var browserify = false;
}

var source = require("vinyl-source-stream"),
    buffer = require("vinyl-buffer"),
    rename = require("gulp-rename");

function handleBrowserifyErrors() {
    var error = Array.prototype.slice.call( arguments )[ 0 ];

    if ( error._babel ) {
        error.source = "babel ";

        var filename = error.filename.split("/").slice(-1)[0];

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

    this.emit("end");
}

var Script = {};

Script.bundle = function(options) {

    if (!browserify) {
        console.error("browserify is not installed");
        return;
    }

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
    options.transforms = options.transforms || [];
    options.watch = options.watch || false;
    options.standalone = options.standalone || false;

    if (options.sourcemaps === undefined) {
        options.sourcemaps = true;
    }

    if (options.compress && !uglify) {
        console.error("gulp-uglify is not installed, disabled options.compress or install it.");
        return;
    }

    if (options.sourcemaps && !sourcemaps) {
        console.error("gulp-sourcemaps is not installed, disable options.sourcemaps or install it.");
        return;
    }

    options.reference_dependencies = options.reference_dependencies || false;
    options.include_dependencies = options.include_dependencies || false;

    var bundle_options = {
        entries: options.entries,
        paths: options.paths,
        debug: options.debug,

        // For watchify...
        cache: {},
        packageCache: {},
        fullPaths: true
    };

    if ( options.standalone ) {
        bundle_options.standalone = options.standalone;
    }
    var bundler = browserify(bundle_options);

    var i = 0;
    if ( options.reference_dependencies ) {
        for ( i = 0; i < options.reference_dependencies.length; i++ ) {
            bundler.external( options.reference_dependencies[ i ] );
        }
    }
    if ( options.include_dependencies ) {
        for ( i = 0; i < options.include_dependencies.length; i++ ) {
            bundler.require( options.include_dependencies[ i ] );
        }
    }

    options.transforms.forEach( function(transform) {
        bundler.transform(transform);
    });

    bundler.on("time", function(time) {
        build.log( "script",
            gutil.colors.cyan( options.dest_folder + options.dest_filename ),
            "built in",
            gutil.colors.magenta( time + "ms" ) );
    });

    var bundle = function() {
        return bundler
            .bundle( )
            .on( "error", handleBrowserifyErrors )
            .pipe( source( options.dest_filename ) )
            .pipe( buffer( ) )
            .pipe( sourcemaps.init( { loadMaps: true } ) )

                .pipe( options.compress ? uglify() : gutil.noop() )
                .pipe( rename( options.dest_filename ) )
                .pipe( gulp.dest( options.dest_folder ) )

            // Pipe out the sourcemaps
            .pipe( options.sourcemaps ? sourcemaps.write( "./" ) : gutil.noop() )
            .pipe( gulp.dest( options.dest_folder ) );
    };

    if (options.watch) {
        if (!watchify) {
            console.error("watchify is not installed, disable options.watch or install it.");
            return;
        }
        bundler = watchify( bundler );
        bundler.on("update", bundle);
    } else {
        build.log( "script",
            gutil.colors.cyan( options.dest_folder + options.dest_filename ), "building statically" );
    }

    return bundle();
};

module.exports = Script;
