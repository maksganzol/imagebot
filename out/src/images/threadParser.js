"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
exports.getThreads = (board = 'b') => new Promise((res, rej) => {
    const url = `https://2ch.pm/${board}/catalog.json`;
    node_fetch_1.default(url, { method: 'GET' })
        .then((resp) => resp.json())
        .then((catalog) => res(catalog.threads))
        .catch((err) => rej(err));
});
//# sourceMappingURL=threadParser.js.map