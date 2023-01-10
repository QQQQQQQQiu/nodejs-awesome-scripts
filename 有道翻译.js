
import CryptoJS from "crypto-js";
import {stringify} from 'qs'
import crypto from 'crypto'
import {request} from './utils/request.js'
import {flatten} from './utils/methods.js'
import {question} from './utils/询问输入.js'

async function translate(words = '') {
  let cookie = ''
  await request('GET', 'http://fanyi.youdao.com/', '' , {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    },
    async onRes ({headers}) {
      cookie = headers['set-cookie']?.[0].split(';')[0]
    }
  })
  let api = 'http://dict.youdao.com/webtranslate?smartresult=dict&smartresult=rule'
  let ts = String(+new Date())
  let enStr = `client=fanyideskweb&mysticTime=${ts}&product=webfanyi&key=fsdsogkndfokasodnaso`
  let sign = CryptoJS.MD5(CryptoJS.enc.Utf8.parse(enStr)).toString()
  let headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    "Content-Type": "application/x-www-form-urlencoded",
    "Referer": "http://fanyi.youdao.com/",
    Cookie: cookie,
  }
  let postdata = {
    'i': words,
    'from': 'AUTO',
    'to': 'AUTO',
    'dictResult':'true',
    'keyid':'webfanyi',
    'sign': sign,
    'client': 'fanyideskweb',
    'product':'webfanyi',
    'appVersion':'1.0.0',
    'vendor':'web',
    'pointParam':'client,mysticTime,product',
    'mysticTime': ts,
    'keyfrom': 'fanyi.web',
  }
  let data = await request('POST', api, stringify(postdata), {
    headers
  })
  let resStr = flatten(JSON.parse(decrypt(data))?.translateResult).map(({tgt})=> tgt).toString()
  console.log(`翻译：\n ${words}\n ${resStr}`);
}

const m1 = crypto.createHash('md5');
const m2 = crypto.createHash('md5');
function decrypt(endata) {
    var keystr='ydsecret://query/key/B*RGygVywfNBwpmBaZg*WT7SIOUP2T0C9WHMZN39j^DAdaZhAnxvGcCY6VYFwnHl'
    var ivstr='ydsecret://query/iv/C@lZe2YzHtZ2CYgaXKSVfsb7Y4QWHjITPPZ0nQp87fBeJ!Iv6v^6fvi2WN@bYpJ4'
    var a = Buffer.alloc(16, m1.update(keystr).digest())
        , r = Buffer.alloc(16, m2.update(ivstr).digest())
        , i = crypto.createDecipheriv("aes-128-cbc", a, r);
    let s = i.update(endata, "base64", "utf-8");
    return s += i.final("utf-8"),
        s
}

(async () =>{
  let words = await question('请输入需要翻译的文字：')
  await translate(words)
  process.exit(1)
})()