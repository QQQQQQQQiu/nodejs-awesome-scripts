import http from 'node:http'
import https from 'node:https'
import { Buffer } from 'node:buffer';


export async function request(method = 'GET', url = '', params, options = {}) {
  const xhr = /^https/.test(url) ? https: http
  const {
    headers = {},
    onData = undefined,
    onRes = undefined,
    onEnd = undefined,
    resType = 'Text' // Text Buffer
  } = options
  const requestOptions = {
    method,
    headers
  }
  return new Promise((resolve, reject) => {
    const req = xhr.request(url, requestOptions, async (res) => {
      // console.log(`STATUS: ${res.statusCode}`);
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      onRes && await onRes(res)
      // res.setEncoding('utf8')
      let resBody = Buffer.alloc(0)
      res.on('data', async chunk => {
        // console.log(`BODY: ${chunk}`)
        resBody = Buffer.concat([resBody, chunk])
        onData && await onData(chunk)
      })
      res.on('end', async () => {
        console.warn(`请求完毕：${url}`);
        onEnd && await onEnd(resBody)
        resolve(formatRes(resBody, resType))
      });
    });
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      reject(e)
    });
    // Write data to request body
    params && req.write(params)
    req.end()
  })
}

async function formatRes(bufferArr, resType) {
  if (resType === 'Text') {
    return bufferArr.toString()
  }
  if (resType === 'Buffer') {
    return bufferArr
  }
  return bufferArr
}