import { myFetch } from './utils/fetch.js'

async function main() {

  const res = await myFetch("http://127.0.0.1:8081/", {
    responseType: 'text',
    contentType: 'json',
    method: "POST",
    headers: {
      'accept': 'text/event-stream',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh,zh-CN;q=0.9,en;q=0.8,zh-TW;q=0.7',
      'content-type': 'application/json',
      'cookie': 'dcm=8; dcs=1',
      'origin': 'https://duckduckgo.com',
      'referer': 'https://duckduckgo.com/',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
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



main()