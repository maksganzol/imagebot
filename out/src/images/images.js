"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imageFetcher_1 = require("./imageFetcher");
const threadParser_1 = require("./threadParser");
const regexPatterns_1 = require("./regexPatterns");
const TopicPattern = regexPatterns_1.patterns['ZSM'];
const urlPattern = /.+\.jpg$/;
exports.getImages = async () => Promise.all((await threadParser_1.getThreads())
    .filter(({ comment }) => TopicPattern.test(comment))
    .map(({ num }) => num)
    .map(imageFetcher_1.getThreadImgsUrl))
    .then((urls) => Promise.all(urls.flat()
    .filter((url) => urlPattern.test(url))
    .slice(undefined, 50)
    .map(imageFetcher_1.getImageBuffer)));
//# sourceMappingURL=images.js.map