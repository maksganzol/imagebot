"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TelegramBot = require("node-telegram-bot-api");
const config_1 = require("./config");
const fs_1 = require("fs");
const images_1 = require("./images/images");
const fileList = async (path) => new Promise((res, rej) => {
    fs_1.readdir(path, (err, files) => {
        if (err)
            rej(err);
        res(files);
    });
});
const bot = new TelegramBot(config_1.token, { polling: true });
bot.onText(/(test)/, (msg, match) => {
    if (msg.from) {
        const id = msg.from.id;
        const name = match ? match[1] : 'noname';
        bot.sendMessage(id, name);
    }
});
const actualFiles = [];
images_1.updateImages()
    .then(() => fileList('./res'))
    .then(files => {
    files.map(file => actualFiles.push(file));
    setInterval(async () => {
        const revFiles = actualFiles.reverse();
        console.log(revFiles[0]);
        if (revFiles[0]) {
            await bot.sendPhoto(config_1.channelId, fs_1.readFileSync(`./res/${revFiles[0]}`));
            actualFiles.pop();
        }
        else {
            await images_1.updateImages();
        }
    }, 15 * 60 * 1000);
});
//# sourceMappingURL=index.js.map