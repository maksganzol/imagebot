"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const imageFetcher_1 = require("./imageFetcher");
const threadParser_1 = require("./threadParser");
const rimraf_1 = require("rimraf");
const regexPatterns_1 = require("./regexPatterns");
const ZSMPattern = regexPatterns_1.patterns['ZSM'];
const urlPattern = /.+\.jpg$/;
rimraf_1.sync('./res');
fs_1.mkdirSync('./res');
exports.updateImages = async () => {
    const threads = (await threadParser_1.getThreads())
        .filter(({ comment }) => ZSMPattern.test(comment));
    for (let i = 0; i < threads.length; i++) {
        console.log(`Thread ${threads[i].num} is being processed`);
        const urls = (await imageFetcher_1.getThreadImgsUrl(threads[i].num)).filter(url => urlPattern.test(url));
        for (let j = 0; j < urls.length; j++) {
            if (j > 50)
                break;
            const img = await imageFetcher_1.getImageBuffer(urls[j]);
            fs_1.writeFileSync(`./res/${threads[i].num}-${urls[j].split('/').reverse()[0]}`, img);
        }
    }
    console.log('Downloading completed');
};
//# sourceMappingURL=images.js.map