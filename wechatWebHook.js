
import CryptoJS from "crypto-js";
import {stringify} from 'qs'
import crypto from 'crypto'
import {request} from './utils/request.js'
import {flatten} from './utils/methods.js'
import {question} from './utils/询问输入.js'

(async () =>{
  let res = await request('POST', 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=0545cd9d-8d0f-4146-a2c2-82c8544a851e', {
    contentType: 'json',
    data: {
      "msgtype": "text",
      "text": {
        "content": "广州\n今日天气：29度，大部分多云，降雨概率：60%",
        "mentioned_list":[],
        "mentioned_mobile_list":[]
      }
    }
  })
  console.log('res :>> ', res);
})()