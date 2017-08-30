'use strict';

var path = require('path');
var fs = require('fs');
var sass = require('./sass');
var jspm = require('jspm');
var fromFileURL = require('./common').fromFileURL;


module.exports = function(url, prev, done) {
    if (url.substr(0, 5) != 'jspm:') {
        return done(); // bailout
    }

    url = url.replace(/^jspm:/, '');

    var loader = new jspm.Loader();
    var normalizedPath = loader.normalizeSync(url);
    console.log(normalizedPath);
    var file = resolveFile(normalizedPath, '.scss');
    if (file) {
        return done(file);
    }
    else {
        file = resolveFile(normalizedPath, '.sass');
        if (file) {
            return done(file);
        }
        else {
            file = resolveFile(normalizedPath, '.css');
            if (file) {
                return done(file);
            }
            else {
                return done();
            }
        }
    }

    function resolveFile(filePath, extension) {
        var stat;
        var parts;
        var origFilePath;
        var regex;
        var scssRegex = /\.scss$/;
        var sassRegex = /\.sass$/;

        console.log("filepath without double extension?", filePath);

        origFilePath = path.resolve(fromFileURL(filePath).replace(/\.js$/, extension));
        console.log("stripped js", origFilePath);
        filePath = origFilePath;

        /**
         * This is such a dirty hack, need to rewrite this from scratch!
         */
        if (filePath.endsWith(extension + extension)) {
            filePath = filePath.substring(0, filePath.length - extension.length);
        }

        try {
            stat = fs.statSync(filePath);
            if (extension === '.css') {
                // The file is there, with the .css extension.
                // Strip the .css from the filePath to have SASS build this into
                // the output. If we keep the .css extension here, it leaves it
                // a plain CSS @import for the browser to resolve.
                filePath = filePath.replace(/\.css$/, '');
            }
        } catch (e) {
            if (extension === '.css') {
              return null;
            } else {
                try {
                    parts = filePath.split(path.sep);
                    parts[parts.length - 1] = '_' + parts[parts.length - 1];
                    filePath = parts.join(path.sep);
                    stat = fs.statSync(filePath);
                } catch (e) {
                    return null;
                }
            }
        }
        if (stat.isFile()) {
            return { file: filePath };
        } else {
            return null;
        }
    }
};
