import { exit as kill, argv } from 'process';

export function flatten(array = []) {
  let res = [];
  array.map((item) => {
    if (Array.isArray(item)) {
      res = res.concat(flatten(item));
    } else {
      res.push(item);
    }
  });
  return res;
};

export function exit(n) {
  console.log('程序结束');
  kill(n);
};

/**
 * 脚本执行参数转对象，要求`foo=bar`格式
 * @param {Array | process.argv} arr 
 * @returns 
 */
export function queryScriptParams(arr = argv) {
  let argArr = arr.filter(item => /(.*)=(.*)/.test(item))
  if (!argArr.length) return {}
  let obj = {}
  argArr.forEach(element => {
    let arr = element.match(/(.*)=(.*)/)
    obj[arr[1]] = arr[2]
  });
  return obj
};


export function delay(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * 从cookie字符串中提取指定字段
 * @param {string} cookieString 
 * @param {Array} fields 
 * @return {Object}
 * @example
 * extractCookieFields('a=1; b=2; c=3', ['a', 'c']) // {a: '1', c: '3'}
 */
export function extractCookieFields(cookieString, fields) {
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