import * as TelegramBot from 'node-telegram-bot-api'
import { token, channelId } from './config';
import { getImages } from './images/images';

const state: { setIntervalId: any, files: Buffer[]} = { setIntervalId: 0, files: []}

const bot = new TelegramBot(token, {polling: true})

bot.onText(/\/(test)/, (msg: TelegramBot.Message, match: RegExpExecArray |null) => {
    if(msg.from) {
        const id = msg.from.id;
        const name = match ? match[1] : 'noname'
        bot.sendMessage(id, name);
    }
})

bot.onText(/\/start\s*(?:-t\s+(\d+))?/, async (msg: TelegramBot.Message, match: RegExpExecArray |null) => {
    if(msg.from) {
        const id = msg.from.id;
        await bot.sendMessage(id, 'Posting started.')
        state.files.push(...(await getImages()))
        const timeout = match ? Number(match[1]) : 15 * 1000 * 60
        await bot.sendMessage(id, `${state.files.length} is available. Post timeout set to ${timeout} mls`);
        state.setIntervalId = setInterval(async () => {
            const file = state.files.reverse()[0];
            if(file){
                await bot.sendPhoto(channelId, file)
                state.files.pop()
                return;
            } 
            if(state.files.length <= 0) state.files.push(...(await getImages()))
        }, timeout)
    }
});

bot.onText(/\/stop/, async (msg: TelegramBot.Message, match: RegExpExecArray |null) => {
    console.log('Bot stopped')
    clearInterval(state.setIntervalId || 0)
    if(msg.from) {
        await bot.sendMessage(msg.from.id, 'Bot stopped.')
    }
});




