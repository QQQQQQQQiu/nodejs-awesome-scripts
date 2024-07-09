import { myFetch } from './utils/fetch.js'

async function main2() {
  const userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0"
  const headers = {
    'accept': '*/*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'zh,zh-CN;q=0.9,en;q=0.8,zh-TW;q=0.7',
    'cache-control': 'no-store',
    'cookie': 'dcm=1',
    'pragma': 'no-cache',
    'referer': 'https://duckduckgo.com/',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': userAgent,
    'x-vqd-accept': '1',
  }
  let xvqd4 = ''
  
  let xvqd4resp = await myFetch(`https://duckduckgo.com/duckchat/v1/status`, {
    responseType: 'original',
    headers: {
      ...headers,
      "p-x-vqd-accept": "1",
    }
  })
  xvqd4 = xvqd4resp.headers.get('x-vqd-4')
  console.log('xvqd4resp.text() :>> ', await xvqd4resp.text());
  console.log('xvqd4 :>> ', xvqd4);
  // debugger
  const res = await myFetch("https://duckduckgo.com/duckchat/v1/chat", {
    responseType: 'stream',
    contentType: 'json',
    "method": "POST",
    "headers": {
        'accept': 'text/event-stream',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'zh,zh-CN;q=0.9,en;q=0.8,zh-TW;q=0.7',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'cookie': 'dcm=1',
        'origin': 'https://duckduckgo.com',
        'pragma': 'no-cache',
        'referer': 'https://duckduckgo.com/',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': userAgent,
        "x-vqd-4": xvqd4,
        "x-vqd-accept": "1"
    },
    data: {
      model: 'gpt-3.5-turbo-0125',
      messages: [ { role: 'user', content: '你好，你是哪位？' } ]
    },
    streamOptions: {
      type: 'text',
      onProgress(message) {
        console.log('message :>> ', message);
      }
    }
  });
  console.log('done :>> ', res)
}



main2()