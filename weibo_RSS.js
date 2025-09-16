import { myFetch } from './utils/fetch.js'
import {send_msg} from './wechatWebHook.js';
import {delay, extractCookieFields} from './utils/methods.js';

let REQ_COOKIE = ''
let WAIT_TIME = 5 * 1000

const WATCH_ARR = [
  {
    containerid: '1076031896820725',
    uid: '1896820725',
    userName: '天津股侠'
  },
  {
    containerid: '1076037360562686',
    uid: '7360562686',
    userName: '新侠客行'
  },
]

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const Cache = {}
function getRuningData(uid = '') {
  if (Cache[uid]) return Cache[uid]
  Cache[uid] = {
    current_msg_id: '',
    freeze_wait_count: 0,
    err_count: 0
  }
  return Cache[uid]
}

async function start(options = {}) {
  const {
    uid = '',
    userName = '',
    containerid = '',
  } = options
  
  let {data:{cards}} = await myFetch("https://p.000178.xyz/https://m.weibo.cn/api/container/getIndex", {
    responseType: 'json',
    method: "GET",
    headers: {
      // 'accept': '*/*',
      'p-Cookie': REQ_COOKIE,
      // 'User-Agent': UA
    },
    data: {
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

  const uidObj = getRuningData(uid)
  if (uidObj.current_msg_id === bid) return
  uidObj.current_msg_id = bid

  const res_content_data = await myFetch(`https://m.weibo.cn/statuses/show`, {
    responseType: 'json',
    method: "GET",
    headers: {
      'accept': '*/*',
      'referer': 'https://m.weibo.cn/',
      'Cookie': REQ_COOKIE,
      'User-Agent': UA
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
  REQ_COOKIE = await fetchCookie()
  while (true) {
    for (let index = 0; index < WATCH_ARR.length; index++) {
      const element = WATCH_ARR[index];
      const uidObj = getRuningData(element.uid)
      if (uidObj.freeze_wait_count > 0) {
        console.log('阈值 -1 :>> ', element.userName, uidObj.freeze_wait_count);
        uidObj.freeze_wait_count -= 1
        continue
      }
      await start(element).catch(async err => {
        uidObj.err_count += 1
        console.error(`ERR [${new Date().toLocaleString()}] [${element.userName}-err.${uidObj.err_count}] :>> `, err);
        
        if (uidObj.err_count == 2) {
          console.log('错误达到2，尝试获取cookie');
          REQ_COOKIE = await fetchCookie()
        }
        if (uidObj.err_count > 2) {
          console.log('错误达到阈值 :>> ', element.userName);
          uidObj.freeze_wait_count = 12 * 5
          uidObj.err_count = 0
        }
        return 'FAIL'
      }).then((res)=>{
        if (res === 'FAIL') return
        if (uidObj.err_count > 0) {
          console.log('成功，错误计数归零');
          uidObj.err_count = 0
        }
      })
    }
    await delay(WAIT_TIME)
  }
}


async function fetchCookie() {
  const res = await myFetch("https://visitor.passport.weibo.cn/visitor/genvisitor2", {
    responseType: 'original',
    contentType: 'form',
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {
      'cb': `visitor_gray_callback`,
    },
  });
  console.log('cookie :>> ', res.headers.get('set-cookie'));
  const obj = extractCookieFields(res.headers.get('set-cookie'), ['SUB', 'SUBP'])
  // return `SUB=${obj.SUB}; SUBP=${obj.SUBP};`
  return `SUB=x; SUBP=y;`
}

console.log(`starting... ${ new Date().toLocaleString() }`);
main()
