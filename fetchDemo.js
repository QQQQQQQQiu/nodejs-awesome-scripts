import { myFetch } from './utils/fetch.js'


function extractCookieFields(cookieString, fields) {
    const cookies = cookieString.split(',').map(cookie => cookie.trim());
    const result = {};
    fields.forEach(field => {
        const regex = new RegExp(`${field}=([^;]+)`);
        cookies.forEach(cookie => {
            const match = cookie.match(regex);
            if (match) {
                result[field] = match[1];
            }
        });
    });
    return result;
}

async function main() {

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
  // console.log('done :>> ', res)

  // console.log('headers :>> ', res.headers);
  console.log('cookie :>> ', res.headers.get('set-cookie'));
  // document.cookie = res.headers.get('set-cookie')
  // console.log('document.cookie :>> ', document.cookie);

  let str = extractCookieFields(res.headers.get('set-cookie'), ['SUB', 'SUBP'])
  console.log('str :>> ', str);

 let resp =  await myFetch("https://p.000178.xyz/https://m.weibo.cn/api/container/getIndex", {
      responseType: 'json',
      method: "GET",
      headers: {
        'p-Cookie': `SUB=${str.SUB}; SUBP=${str.SUBP};`,
      },
      data: {
        containerid: '1076031896820725'
      },
    });
    console.log('res :>> ', resp);
}



main()