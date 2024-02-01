
import CryptoJS from "crypto-js";
import qs from 'qs'
import crypto from 'crypto'
import { request } from './utils/request.js'
import { flatten } from './utils/methods.js'

async function init() {
  let busObjs = {
    B8: {
      arr: [],
      apiParams: {
        "appid": "miniapp",
        "data": JSON.stringify({
          "direction": 0,
          "routeId": "725",
          "routeStationId": "2122988"
        }),
        "reqpara": JSON.stringify({
          "gpstime": 1706067397876,
          "lng": 113.34734350186994,
          "lat": 23.124777602542462,
          "direc": "",
          "version": 1,
          "devno": "o9ivq0AIBo-zR2qhThwkk7lpR8MU",
          "devtype": 4,
          "versiontype": 2,
          "uid": "o9ivq0AIBo-zR2qhThwkk7lpR8MU",
          "reserved": ""
        }),
        "reqtime": "1706067397876",
        "sign": "D045B562603074F6F5358F80F7B4F93A"
      }
    },
    B22: {
      arr: [],
      apiParams: {
        "appid": "miniapp",
        "data": "{\"direction\":\"0\",\"routeId\":\"742\",\"routeStationId\":\"1213943\"}",
        "reqpara": JSON.stringify({
          "gpstime": 1706078514220,
          "lng": 113.34737450732376,
          "lat": 23.124769884189245,
          "direc": "",
          "version": 1,
          "devno": "o9ivq0AIBo-zR2qhThwkk7lpR8MU",
          "devtype": 4,
          "versiontype": 2,
          "uid": "o9ivq0AIBo-zR2qhThwkk7lpR8MU",
          "reserved": ""
        }),
        "reqtime": "1706078514220",
        "sign": "1C514655E50E378B4A9A8B4FC173CCC0"
      }
    },
  }
  let key = 'B8'
  const res = await request('GET', `https://rycxapi.ruyuechuxing.com/xxt-min-api/bus2/route/getDynamic`, {
    contentType: 'url',
    data: busObjs[key].apiParams,
    headers: {
      'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.30(0x18001e32) NetType/WIFI Language/zh_CN`,
      Referer: `https://servicewechat.com/wxe027f0adf505a625/85/page-frame.html`
    }
  })
  console.log('res :>> ', res);
  let resObj = JSON.parse(res)


  resObj.retData.time?.forEach(item => {
    if (item.arriveEnd !== 1) return
    if (item.count === 0) busObjs[key].arr.push(`即将进站`)
    busObjs[key].arr.push(`${item.time}分钟后到达（${item.count}站）`)
  })
  debugger
}
init()