import * as fs from 'node:fs/promises'

export const isHasFile = async (filePath) => {
  let res = true
  await fs.readFile(filePath).catch(err => {
    // console.log('readFileByStr err:', err)
    res = false
  })
  return res
}
export const readFileByStr = async (filePath) => {
  let str = await fs.readFile(filePath, {encoding: 'utf8'}).catch(err => {
    // console.log('readFileByStr err:', err)
  })
  return str ?? ''
}
export const readFileByObj = async (filePath) => {
  let str = await readFileByStr(filePath)
  return JSON.parse(str || '{}')
}
export const writeFileStr = async (filePath, str = '') => {
  return await fs.writeFile(filePath, str)
}
export const writeFileObj = async (filePath, dataObj = {}) => {
  return await fs.writeFile(filePath, JSON.stringify(dataObj))
}
export const writeFileOther = async (filePath, data, opt) => {
  return await fs.writeFile(filePath, data, opt)
}
