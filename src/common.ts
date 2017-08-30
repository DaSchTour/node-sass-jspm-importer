import * as path from ('path');


export function fromFileURL(pathUrl) {
    return pathUrl.substr(process.platform.match(/^win/) ? 8 : 7).replace(path.sep, '/');
};
