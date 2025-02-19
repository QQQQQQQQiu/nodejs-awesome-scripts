import { myFetch } from './utils/fetch.js'
// 印度指数
async function main() {
  const res = await myFetch("https://p.000178.xyz/https://api.bseindia.com/RealTimeBseIndiaAPI/api/GetSensexData/w?code=16", {
    method: 'GET',
    responseType: 'json',
    "headers": {
      "p-accept": "application/json, text/plain, */*",
      "p-accept-language": "zh,zh-CN;q=0.9,en;q=0.8,zh-TW;q=0.7",
      "p-cache-control": "no-cache",
      "p-pragma": "no-cache",
      "p-sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"100\"",
      "p-sec-ch-ua-mobile": "?0",
      "p-sec-ch-ua-platform": "\"macOS\"",
      "p-sec-fetch-dest": "empty",
      "p-sec-fetch-mode": "cors",
      "p-sec-fetch-site": "same-site",
      "p-referer": "https://www.bseindia.com/",
    },
  });
  console.log('res :>> ', JSON.stringify(res));
  await main()
}

main()