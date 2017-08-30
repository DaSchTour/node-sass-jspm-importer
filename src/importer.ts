'use strict';

import path from 'path';
import fs from 'fs';
import sass from './sass';
import jspm from 'jspm';
import fromFileURL from './common';


const importer(url, prev, done) {
    if (url.substr(0, 5) != 'jspm:') {
        return done(); // bailout
    }

    var module = url.replace(/^jspm:/, '').split('/')[0];
    var url = url.replace(/^jspm:/, '');
    jspm.setPackagePath('.');
    var loader = new jspm.Loader();

    console.log("package: ", module, loader.has(module));
    console.log("package: ", url, loader.has(url));
    console.log("normalize: ", url, loader.normalizeSync(url));
    console.log("normalize: ", module, loader.normalizeSync(module));
    console.log("test npm:", loader.has("npm:angular"));

    var normalizedPath = loader.normalizeSync(url);
    console.log(normalizedPath);

    var file = resolveFile(normalizedPath, '.scss');
    if (file) {
        return done(file);
    } else {
        file = resolveFile(normalizedPath, '.sass');
        if (file) {
            return done(file);
        } else {
            file = resolveFile(normalizedPath, '.css');
            if (file) {
                return done(file);
            } else {
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
        console.log("filepath", filePath);
        origFilePath = path.resolve(fromFileURL(filePath).replace(/\.js$/, extension));
        console.log("resolving file", origFilePath, filePath);
        if (!filePath.endsWith(extension)) {
            filePath = origFilePath + extension;
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
                    stat = fs.statSync(filePath);
                    console.log("file paht:", filePath, stat)
                    if (!stat.isFile()) {
                        parts = filePath.split(path.sep);
                        parts[parts.length - 1] = '_' + parts[parts.length - 1];
                        filePath = parts.join(path.sep);
                        stat = fs.statSync(filePath);
                    }
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
}

export default importer;
