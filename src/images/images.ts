import { writeFileSync, mkdirSync } from 'fs'
import { getImageBuffer, getThreadImgsUrl } from './imageFetcher';
import { getThreads } from './threadParser';
import { sync } from 'rimraf'
import { patterns } from './regexPatterns';

const ZSMPattern = patterns['ZSM']
const urlPattern = /.+\.jpg$/
sync('./res')
mkdirSync('./res')
export const updateImages = async (): Promise<void> => {
    const threads = (await getThreads())
        .filter(({comment}) => ZSMPattern.test(comment))
    for(let i = 0; i < threads.length; i++) {
        console.log(`Thread ${threads[i].num} is being processed`)
        const urls = (await getThreadImgsUrl(threads[i].num)).filter(url => urlPattern.test(url))
        for(let j = 0; j < urls.length; j++) {
            if(j > 50 ) break;
            const img = await getImageBuffer(urls[j])
            writeFileSync(`./res/${threads[i].num}-${urls[j].split('/').reverse()[0]}`, img)
        }
    }
    console.log('Downloading completed')
}