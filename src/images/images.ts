import { getImageBuffer, getThreadImgsUrl } from './imageFetcher';
import { getThreads } from './threadParser';
import { patterns } from './regexPatterns';

const TopicPattern = patterns['ZSM']
const urlPattern = /.+\.jpg$/

export const getImages = async (): Promise<Buffer[]> => Promise.all(
    (await getThreads())
        .filter(({comment}) => TopicPattern.test(comment))
        .map(({num}) => num)
        .map(getThreadImgsUrl))
        .then((urls: string[][]) => 
            Promise.all(urls.flat()
                .filter((url: string) => urlPattern.test(url))
                .slice(undefined, 50)
                .map(getImageBuffer))
);