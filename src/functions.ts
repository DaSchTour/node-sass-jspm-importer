'use strict';

import * as path from 'path';
import { fromFileURL } from './common';
import sass from './sass';
import jspm from 'jspm';
import jspm_config from 'jspm/lib/config';
jspm_config.loadSync();


const resolve_function(path_prefix) {
    path_prefix = path_prefix || '';
    return {
        'jspm_resolve($exp)': function(exp, done) {
            jspm.normalize(exp.getValue()).then(function(respath) {
                respath = path.resolve(fromFileURL(respath).replace(/\.js$|\.ts$/, ''));
                var res = path.join(path_prefix, path.relative(jspm_config.pjson.packages, respath));
                // strip any default files that 0.17 includes, we only want
                // up to the package name
                if (res.indexOf("@") > -1) {
                    res = res.match(/.+@[^\/]+/)[0];
                }
                done(new sass.types.String(res));
            }, function(e) {
                done(sass.compiler.types.Null());
            });
        }
    };
};

export default resolve_function;
