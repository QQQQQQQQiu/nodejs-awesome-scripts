
import {load} from 'cheerio'
import {writeFileOther} from './utils/文件操作.js'
import {parse} from 'qs'
import {request} from './utils/request.js'
import {isHasFile} from './utils/文件操作.js'

/**
 * 方法一
 * 用爬取html的方法截取字符
 */
async function loadWallpaperApi() {
    let resObj = JSON.parse(await request('GET', `https://cn.bing.com/hp/api/model`))
    let imgDataArr = resObj?.MediaContents.map(({ImageContent: {Image: {Url}}})=> {
        return {
            url: /^https/.test(Url) ? Url : `https://cn.bing.com/${Url}`,
            name: parse(Url.split('?')[1]).id
        }
    })
    for (let index = 0; index < imgDataArr.length; index++) {
        const element = imgDataArr[index];
        let filePath = `./temp/${element.name}`
        if (await isHasFile(filePath)) {
            console.log(`已存在：=>${filePath}`);
            continue
        }
        let img = await request('GET', element.url, {
            resType: 'Buffer'
        })
        await writeFileOther(filePath, img, "binary")
        console.log(`存放在： ${filePath}`);
    }
}
loadWallpaperApi()


/**
 * 方法二
 * 用爬取html的方法截取字符
 */
async function parseHTML() {
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
    let img = await request('GET', imgSrc, {
        resType: 'Buffer'
    })
    await writeFileOther(`./temp/${name}`, img, "binary")
    console.log(`存放在 ./temp/${name}`);
}
