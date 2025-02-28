
import wxDecrypt from './wxDecrypt.js';


const config = {
  Token: '123',
  EncodingAESKey: '1111111111111111111111111111111111111111111',
  Appid: '1000002',
  Corpid: 'ww0bc5d487c23a73d8',
  Secret: '0XwUYaz6BGeHeYc8XWLJGgHQHzVdKRTEqdGWFRVrnfc'
}

let msg = `<xml><ToUserName><![CDATA[ww0bc5d487c23a73d8]]></ToUserName><Encrypt><![CDATA[qBHdceTBGlsgiMvbNLNEhlZktBlM5tEvHHfa0v+87YvOyUa1xgq9wOHMHnRLLiM3nELrLm5t7XK//Qdda63jN9mH4ZNsXDufJQZpBGtzKMb28UtsB9IOlCCDtu8z48OB9TC7OvcC3L/PB5NBICf2i1vi9cUwT6zOKjVzGD6pj1x122vpRwkc5c0cNPg2qpkYogc454rg7bYdR+Trm/qB9ooQBzh4D3rrnsPA8vEorttFKqZwxar9H8663wajphzfKPHtoVgtq1v+vrUg/Dl1ynPxip098Zdmux2YmbraTiR0mcnLSJ2J9d2LOOYEcBZfEXlrFED4MIS37ombdDn/aZF3/X3QsGZQTE1kNfagdTlIGwjNabqBwZV/R2NmnBXzmTTR9e8F2Qkwzg2RR0xfmTW+K1nLbNBDhNpZ1EeONYg=]]></Encrypt><AgentID><![CDATA[1000002]]></AgentID></xml>`

let {
  encrypt,
} = parseMessage(msg)
const cryptor = new wxDecrypt(config.Token, config.EncodingAESKey, config.Appid);
var decrypted = cryptor.decrypt(encrypt);
console.log('decrypted :>> ', decrypted.message);
let {
  toUserName,
  fromUserName,
  createTime,
  msgType,
  content,
  msgId,
  agentID,
} = parseMessage(decrypted.message);


export async function send_msg(content = 'Hello, World!') {
  const corpid = config.Corpid;
  const corpsecret = config.Secret
  
  // 构造请求参数
  const params = {
    corpid: corpid,
    corpsecret: corpsecret
  };
  // 构造URL
  const url = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${params.corpid}&corpsecret=${params.corpsecret}`;
  // 发送请求，获取access_token
  let res = await fetch(url).catch(error => console.error('获取access_token失败：', error)); 
  res = await res.json()
  const access_token = res.access_token;
  console.log('access_token :>> ', access_token);
  // 构造请求参数
  const sendMessageParams = {
    touser: toUserName, // 指定接收消息的用户ID，多个用户使用 "|" 分隔
    msgtype: 'text',
    agentid: config.agentID, // 企业微信的应用Agent ID
    text: {
      content // 消息内容
    },
    safe: 0 // 是否加密，0 表示不加密
  };
  const sendMessageUrl = `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${access_token}`;
  let msgRes = await fetch(sendMessageUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sendMessageParams)
  }).catch(error => console.error('消息发送失败：', error));
  msgRes = await msgRes.text()
  console.log('msgRes :>> ', msgRes);
}



// 构造URL

// 发送请求，发送消息









function parseMessage(message) {
  var result = {};
  message.replace(/<xml>|<\/xml>/, '').replace(/<!\[CDATA\[(.*?)\]\]>/ig, '$1').replace(/<(\w+)>(.*?)<\/\1>/g, function (_, key, value) {
    key = key.replace(/(\w)/, function (str) { return str.toLowerCase(); });
    result[key] = value;
  });

  return result;
}