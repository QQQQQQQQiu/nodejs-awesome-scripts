import { myFetch } from './utils/fetch.js'
import {send_msg} from './wechatWebHook.js';
import {delay} from './utils/methods.js';

let ERR_COUNT = 0
let WAIT_TIME = 5 * 1000
let CURRENT_MSG_ID = ''
const WATCH_ARR = [
  {
    uid: '1896820725',
    userName: '天津股侠'
  },
  {
    uid: '7360562686',
    userName: '新侠客行'
  },
]
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'

async function start(options = {}) {
  const {
    uid = '',
    userName = ''
  } = options
  
  let res_home_page = await myFetch("https://m.weibo.cn/api/container/getIndex", {
    responseType: 'json',
    method: "GET",
    headers: {
      'accept': '*/*',
      'user-agent': UA
    },
    data: {
      type: 'uid',
      value: uid
    },
  });
  let containerid = res_home_page.data.tabsInfo.tabs.find(tab => tab.tabKey === 'weibo').containerid

  WAIT_TIME = 5 * 1000
  ERR_COUNT = 0

  res_home_page = null
  // console.log('done config:>> ', containerid)
  let {data:{cards}} = await myFetch("https://m.weibo.cn/api/container/getIndex", {
    responseType: 'json',
    method: "GET",
    headers: {
      'accept': '*/*',
      'referer': 'https://m.weibo.cn/',
      'user-agent': UA
    },
    data: {
      type: 'uid',
      value: uid,
      containerid
    },
  });
  
  let bid = ''
  for (let index = 0; index < cards.length; index++) {
    const element = cards[index];
    if (element.profile_type_id !== 'proweibotop_') {
      bid = element.mblog.bid
      // bid = 'PgSfilMWd'
      break
    }
  }
  containerid = null
  cards = null

  if (CURRENT_MSG_ID === bid) return
  CURRENT_MSG_ID = bid

  const res_content_data = await myFetch(`https://m.weibo.cn/statuses/show`, {
    responseType: 'json',
    method: "GET",
    headers: {
      'accept': '*/*',
      'referer': 'https://m.weibo.cn/',
      'user-agent': UA
    },
    data: {
      id: bid
    },
  });
  let {
    pic_ids = [],
    text = '',
    created_at = '',
    retweeted_status: {
      text: ret_text = '',
      bid: ret_bid = ''
    } = {}
  } = res_content_data.data
  // console.log('res_content_data :>> ', res_content_data);
  // console.log('ret_bid :>> ', ret_bid);

  let msg = `${userName} - ${new Date(created_at).toLocaleString()}\n\n${text}`

  if (ret_bid) {
    msg += `\n------\n👉${ret_text}\n📎https://m.weibo.cn/status/${ret_bid}\n------`
  }

  let imgs = []
  if (pic_ids?.length > 0) {
    imgs = pic_ids.map(id => `https://wx2.sinaimg.cn/large/${id}.jpg`)
  }
  if (imgs.length) {
    let str = imgs.map(url => {
      const obj = {
        url,
        headers:{
          'referer': 'https://m.weibo.cn/',
        }
      }
      return `🖼 https://p.000178.xyz/${encodeURIComponent(JSON.stringify(obj))}`
    }).join('\n')
    msg += `\n\n${str}`
  }

  msg += `\n\n📎 https://m.weibo.cn/status/${bid}`
  
  await send_msg('text', msg)
}

async function main() {
  while (true) {
    for (let index = 0; index < WATCH_ARR.length; index++) {
      const element = WATCH_ARR[index];
      await start({...element}).catch(err => {
        ERR_COUNT += 1
        // console.error(`ERR [No.${ERR_COUNT}] [${new Date().toLocaleString()}] :>> `, err);
        // console.error(`ERR [No.${ERR_COUNT}] [${new Date().toLocaleString()}] :>> CURRENT_MSG_ID `, CURRENT_MSG_ID);
        if (ERR_COUNT > 2) {
          WAIT_TIME = 10 * 60 * 1000
          ERR_COUNT = 0
        }
      })
    }
    await delay(WAIT_TIME)
  }
}

console.log(`starting... ${ new Date().toLocaleString() }`);
main()
