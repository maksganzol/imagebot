"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const props = { method: 'GET' };
exports.getImageBuffer = (imgPath) => new Promise((res, rej) => {
    const url = `https://2ch.pm${imgPath}`;
    node_fetch_1.default(url, props)
        .then((res) => res.buffer())
        .then((buff) => res(buff));
});
exports.getThreadImgsUrl = (threadNum) => node_fetch_1.default(`https://2ch.pm/b/res/${threadNum}.json`, props)
    .then((resp) => resp.json())
    .then((data) => data.threads[0].posts)
    .then(posts => posts.map((post) => post.files))
    .then(files => files.flat())
    .then(files => files.map((file) => file.path));
//# sourceMappingURL=imageFetcher.js.map