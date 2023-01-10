
import {load} from 'cheerio'
import {writeFileOther} from './utils/文件操作.js'
import {parse} from 'qs'
import {request} from './utils/request.js'


async function init() {
    let str = await request('GET', `https://cn.bing.com`)
    console.log('str length:', str?.length)
    let $ = load(str);
    let imgSrc = $('.img_cont')?.attr('style').match(/\([sS]*.+\)/)?.[0]?.slice(1,-1)
    if (!imgSrc) {
        console.log('ERR :', '未截取到图片链接')
        process.exit(0)
    }
    if (!/^https/.test(imgSrc)) {
        imgSrc = `https://cn.bing.com/${imgSrc}`
    }
    console.log('图片链接 :', imgSrc)
    let name = parse(imgSrc.split('?')[1]).id
    let img = await request('GET', imgSrc, undefined, {
        resType: 'Buffer'
    })
    await writeFileOther(`./temp/${name}`, img, "binary")
    console.log(`存放在 ./temp/${name}`);
}

init()