import { myFetch } from './utils/fetch.js'

async function main2() {
  const userAgent = "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0"
  const headers = {
    'p-accept': '*/*',
    'p-accept-encoding': 'gzip, deflate, br',
    'p-accept-language': 'zh,zh-CN;q=0.9,en;q=0.8,zh-TW;q=0.7',
    'p-cache-control': 'no-store',
    'p-cookie': 'dcm=8; dcs=1',
    'p-pragma': 'no-cache',
    'p-referer': 'https://duckduckgo.com/',
    'p-sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100"',
    'p-sec-ch-ua-mobile': '?0',
    'p-sec-ch-ua-platform': '"macOS"',
    'p-sec-fetch-dest': 'empty',
    'p-sec-fetch-mode': 'cors',
    'p-sec-fetch-site': 'same-origin',
    'p-user-agent': userAgent,
    'p-x-vqd-accept': '1',
  }
  let xvqd4 = ''
  
  let xvqd4resp = await myFetch(`https://p.000178.xyz/https://duckduckgo.com/duckchat/v1/status`, {
    responseType: 'original',
    headers: {
      ...headers,
    }
  })
  xvqd4 = xvqd4resp.headers.get('x-vqd-4')
  console.log('xvqd4resp.text() :>> ', await xvqd4resp.text());
  console.log('xvqd4 :>> ', xvqd4);
  // debugger
  const res = await myFetch("http://127.0.0.1:8081/https://duckduckgo.com/duckchat/v1/chat", {
    responseType: 'text',
    contentType: 'json',
    method: "POST",
    headers: {
      'p-accept': 'text/event-stream',
      'p-accept-encoding': 'gzip, deflate, br',
      'p-accept-language': 'zh,zh-CN;q=0.9,en;q=0.8,zh-TW;q=0.7',
      'p-content-type': 'application/json',
      'p-cookie': 'dcm=8; dcs=1',
      'p-origin': 'https://duckduckgo.com',
      'p-referer': 'https://duckduckgo.com/',
      'p-sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100"',
      'p-sec-ch-ua-mobile': '?0',
      'p-sec-ch-ua-platform': '"macOS"',
      'p-sec-fetch-dest': 'empty',
      'p-sec-fetch-mode': 'cors',
      'p-sec-fetch-site': 'same-origin',
      'p-user-agent': userAgent,
      'p-x-vqd-4': xvqd4,
    },
    data: {
      model: 'o3-mini',
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