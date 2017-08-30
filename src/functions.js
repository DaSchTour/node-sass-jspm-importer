'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var common_1 = require("./common");
var sass_1 = require("./sass");
var jspm_1 = require("jspm");
var config_1 = require("jspm/lib/config");
config_1.default.loadSync();
var resolve_function = function (path_prefix) {
    path_prefix = path_prefix || '';
    return {
        'jspm_resolve($exp)': function (exp, done) {
            jspm_1.default.normalize(exp.getValue()).then(function (respath) {
                respath = path.resolve(common_1.fromFileURL(respath).replace(/\.js$|\.ts$/, ''));
                var res = path.join(path_prefix, path.relative(config_1.default.pjson.packages, respath));
                // strip any default files that 0.17 includes, we only want
                // up to the package name
                if (res.indexOf("@") > -1) {
                    res = res.match(/.+@[^\/]+/)[0];
                }
                done(new sass_1.default.types.String(res));
            }, function (e) {
                done(sass_1.default.compiler.types.Null());
            });
        }
    };
};
exports.default = resolve_function;
