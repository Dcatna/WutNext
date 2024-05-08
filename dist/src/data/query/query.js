"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUrl = void 0;
function buildUrl(base, args = [], listArgs = []) {
    let url = base;
    let first = true;
    for (let { name, value } of args) {
        if (value === undefined) {
            continue;
        }
        if (first) {
            url += `?${name}=${value.toString()}`;
            first = false;
        }
        else {
            url += `&${name}=${value.toString()}`;
        }
    }
    for (let { name, join, value } of listArgs) {
        if (value.length < 1) {
            continue;
        }
        const seperator = join === "AND" ? ',' :
            join === "OR" ? '|' : '';
        if (first) {
            url += `?${name}=${value.join(seperator)}`;
            first = false;
        }
        else {
            url += `&${name}=${value.join(seperator)}`;
        }
    }
    return encodeURI(url);
}
exports.buildUrl = buildUrl;
