// 监听8081端口的http请求, 实现http代理接口
import { createServer } from 'http'

createServer(async (req, res) => {
  // 获取请求信息
  const { 
    method: _method,
    headers: _headers,
    url: _url,
  } = req;
  let body = await new Promise((resolve) => {
    let data = [];
    req.on('data', chunk => data.push(chunk));
    req.on('end', () => resolve(Buffer.concat(data)));
  });

  // 如果是OPTIONS请求，返回支持跨域
  if (_method === 'OPTIONS') {
    res.writeHead(200, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": '*'
    });
    res.end();
    return;
  }
  let {
    url,
    programMode = null,
    options = {}
  } = getOptions(`http://localhost${_url}`)
  let method = _method
  let headers = {}

  // 如果url不合规
  if (!/^http/.test(url)) {
    res.writeHead(400, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": '*'
    });
    res.end('url不合规');
    return;
  }
  // 筛选p-前缀的请求头
  const HeaderPrefix = 'p-'
  for (let key in _headers) {
    let value = _headers[key];
    if (new RegExp(`^${HeaderPrefix}`).test(key)) {
      headers[key.substring(HeaderPrefix.length)] = value;
    }
  }

  if (programMode === 'json') {
    method = options?.method || method
    body = options?.body || body || ''
    headers = {...headers, ...options?.headers}
  }

  const reqObj = {
    method,
    headers,
    body
  }
  if (method === 'GET' || method === 'HEAD') {
    reqObj.body = null
  }
  // 创建代理请求
  const proxyReq = await fetch(url, reqObj);
  if (!proxyReq.ok) {
    res.writeHead(proxyReq.status, proxyReq.headers);
    res.end();
    return
  }
  res.statusCode = proxyReq.status;
  for (const [key, value] of proxyReq.headers.entries()) {
    res.setHeader(key, value);
  }
  // 添加跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  const reader = proxyReq.body.getReader(); // 获取 ReadableStreamDefaultReader
  // 递归读取数据块并写入客户端响应流
  const pump = async () => {
    const { done, value } = await reader.read();
    if (done) {
      res.end();
      return;
    }
    res.write(value);
    pump();
  };
  pump();

}).listen(8081, () => {
  console.log('Server listening on port 8081')
});



/*
  http://xx.xx/https://qq.com
  http://xx.xx/all/{}/https://qq.com
  http://xx.xx/{method:'post',url:'qq.com'}
 */
function getOptions(reqUrl) {
  let reqUrlObj = new URL(reqUrl)
  let host = reqUrlObj.host
  reqUrl = reqUrl.substring(reqUrl.indexOf('//') + 2)
  reqUrl = reqUrl.replace(host, '')
  reqUrl = decodeURIComponent(reqUrl.substring(1));
  let url = ''
  let programMode = null
  let options = {}
  if (/^\{/.test(reqUrl)) {
    programMode = 'json'
    options = JSON.parse(reqUrl)
    url = options?.url
  }
  else if (/^http/.test(reqUrl)) {
    url = reqUrl
  }
  if (/^https:\/\/undefined/.test(url)) {
    url = ''
  }
  
  console.log('req  :>> ', 'reqUrl:',reqUrl, 'url:',url, programMode, options);
  return {
    url,
    programMode,
    options
  }
}