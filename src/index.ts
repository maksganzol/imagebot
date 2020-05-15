import * as TelegramBot from 'node-telegram-bot-api'
import { token, channelId } from './config';
import { readFileSync, readdir} from 'fs';
import { updateImages } from './images/images';

const fileList = async (path: string): Promise<string[]> => new Promise((res, rej) => {
    readdir(path, (err, files) => {
        if(err) rej(err)
        res(files)
    })
})

const bot = new TelegramBot(token, {polling: true})

bot.onText(/(test)/, (msg: TelegramBot.Message, match: RegExpExecArray |null) => {
    if(msg.from) {
        const id = msg.from.id;
        const name = match ? match[1] : 'noname'
        bot.sendMessage(id, name);
    }
})



const actualFiles: string[] = []

updateImages()
    .then(() => fileList('./res'))
    .then(files => {
        files.map(file => actualFiles.push(file))
        setInterval(async () => {
            const revFiles = actualFiles.reverse()
            console.log(revFiles[0])
            if(revFiles[0]){
                await bot.sendPhoto(channelId, readFileSync(`./res/${revFiles[0]}`))
                actualFiles.pop();
            } else {
                await updateImages();
            }
        }, 15 * 60 * 1000)    
    })

    


