"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require();
function fromFileURL(pathUrl) {
    return pathUrl.substr(process.platform.match(/^win/) ? 8 : 7).replace(path.sep, '/');
}
exports.fromFileURL = fromFileURL;
;
