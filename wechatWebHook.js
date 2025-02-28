import { myFetch } from './utils/fetch.js'

export async function send_msg(type = 'text', content = '') {
  const obj = {
    text: {
      "msgtype": "text",
      "text": {
        "content": content,
        "mentioned_list":[],
        "mentioned_mobile_list":[]
      }
    },
    markdown: {
      "msgtype": "markdown",
      "markdown": {
        "content": content
      }
    }
  }
  await myFetch("https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=0545cd9d-8d0f-4146-a2c2-82c8544a851e", {
    responseType: 'text',
    method: "POST",
    contentType: 'json',
    headers: {
      'accept': '*/*',
    },
    data: obj[type]
  });
}