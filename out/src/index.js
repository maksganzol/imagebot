"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TelegramBot = require("node-telegram-bot-api");
const config_1 = require("./config");
const images_1 = require("./images/images");
const state = { setIntervalId: 0, files: [] };
const bot = new TelegramBot(config_1.token, { polling: true });
bot.onText(/\/(test)/, (msg, match) => {
    if (msg.from) {
        const id = msg.from.id;
        const name = match ? match[1] : 'noname';
        bot.sendMessage(id, name);
    }
});
bot.onText(/\/start\s*(?:-t\s+(\d+))?/, async (msg, match) => {
    if (msg.from) {
        state.files.push(...(await images_1.getImages()));
        const id = msg.from.id;
        const timeout = match ? Number(match[1]) : 15 * 1000 * 60;
        await bot.sendMessage(id, `${state.files.length} is available. Post timeout set to ${timeout} mls`);
        state.setIntervalId = setInterval(async () => {
            const file = state.files.reverse()[0];
            if (file) {
                await bot.sendPhoto(config_1.channelId, file);
                state.files.pop();
                return;
            }
            if (state.files.length <= 0)
                state.files.push(...(await images_1.getImages()));
        }, timeout);
    }
});
bot.onText(/\/stop/, async (msg, match) => {
    clearInterval(state.setIntervalId || 0);
});
//# sourceMappingURL=index.js.map