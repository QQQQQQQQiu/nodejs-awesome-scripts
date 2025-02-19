import { myFetch } from './utils/fetch.js'


async function main2() {
  // http://127.0.0.1:801/api/xhr/https://dss3.bdstatic.com/iPoZeXSm1A5BphGlnYG/skin/822.jpg
  const res = await myFetch("http://127.0.0.1:801/api/cmd", {
    responseType: 'text',
    contentType: 'json',
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      's': 'xx',
    },  
    data: 
    /* {
        // url: 'https://ai.000178.xyz',
        url: 'https://cn.bing.com/hp/api/model',
        throwHeaders: false,
        method: 'GET',
        headers: {
          'x': 1
        },
        body: ''
    } */
    [{
        id: 'c1',
        cmd: 'ls'
        },
        {
        id: 'c2',
        cmd: 'df -h'
      },
    ]
  });
  console.log('done :>> ', res)
}

async function main() {
  let params = encodeURIComponent(JSON.stringify({
      // url: 'https://ai.000178.xyz',
      url: 'https://cn.bing.com/hp/api/model',
      throwHeaders: false,
      method: 'GET',
      headers: {
        'x': 1
      },
      body: ''
  }))
  // params = encodeURIComponent(`https://dss3.bdstatic.com/iPoZeXSm1A5BphGlnYG/skin/822.jpg`)
  const res = await myFetch(`http://127.0.0.1:801/api/xhr/xx/${params}`, {
    responseType: 'text',
    contentType: 'json',
    method: "GET",
    headers: {
      's': 'xx',
      'Content-Type': 'application/json',
    },  
    data: null
  });
  console.log('done :>> ', res)
}



main2()