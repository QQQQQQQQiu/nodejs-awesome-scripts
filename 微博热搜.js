import {request} from './utils/request.js'
import {isHasFile, readFileByObj, writeFileObj, writeFileOther, writeFileStr} from './utils/文件操作.js'
import {select} from './utils/询问输入.js'
import {exit} from './utils/methods.js'
import {parseAsync, transforms} from 'json2csv'
import {queryScriptParams} from './utils/methods.js'

const Mode = queryScriptRunAtMode()
const TimeRange = queryScriptParams()['time'] || 1000*60*30 // 轮询模式下间隔30分

const JsonFilePath = './temp/hotSearch.json'

/**
 * 当前脚本支持以下模式运行
 */
const ScriptRunAt = {
  async Default() {
    let hotArr = await loadHotArr()
    let fileInnerData = await saveJsonFile(hotArr)
    let y_n = await select('是否需要生成csv表格文件？', [{label: '是', value: 'y'}, {label: '否', value: 'n'}])
    if (y_n === 'n') {
      exit()
    }
    if (y_n === 'y') {
      await saveCsvFile(fileInnerData)
    }
    exit()
  },
  async LoopQuery() {
    let hotArr = await loadHotArr()
    await saveJsonFile(hotArr)
    setTimeout(async () => {
      ScriptRunAt.LoopQuery()
    }, TimeRange);
  },
  async TranslateJason2Csv() {
    let fileInnerData = await readFileByObj(JsonFilePath)
    await saveCsvFile(fileInnerData)
  },
}

// 执行
ScriptRunAt[Mode]()

/**
 * 调微博热搜接口
 * @returns array
 */
async function loadHotArr() {
  let text = await request('GET', 'https://weibo.com/ajax/side/hotSearch')
  let resObj = JSON.parse(text)
  let hotArr = resObj.data.realtime.reduce((result, item) => {
    if (item.is_ad) return result
    let obj = {
      word: item.word,
      word_scheme: item.word_scheme,
      label_name: item.label_name,
      num: item.num,
      category: item.category,
      note: item.note,
    }
    result.push(obj)
    return result
  }, [])
  return hotArr
}

async function saveJsonFile(hotArr = []) {
  let hotData = {
    recordTime: +new Date() + '',
    hotArr
  }
  let fileInnerData = []
  if (await isHasFile(JsonFilePath)) {
    fileInnerData = await readFileByObj(JsonFilePath)
    console.log(`文件已存在，内置数据${fileInnerData.length}条`);
  }
  fileInnerData.push(hotData)
  await writeFileObj(JsonFilePath, fileInnerData)
  console.log(`${new Date().toLocaleString()}热搜数据保存完成，文件：${JsonFilePath} \n`);
  return fileInnerData
}

async function saveCsvFile(fileInnerData = []) {
  const csvFields = ['recordTime', 'hotArr.word', 'hotArr.word_scheme', 'hotArr.label_name', 'hotArr.num', 'hotArr.category', 'hotArr.note'];
  const csvPaths = [transforms.unwind({ paths: ['hotArr'], blankOut: true })];
  const csvInnerStr = await parseAsync(fileInnerData,{
    fields:csvFields,
    transforms:csvPaths
  });
  await writeFileStr(`./temp/hotSearch.csv`, csvInnerStr)
  console.log(`csv文件保存完成，文件：./temp/hotSearch.csv`);
}

/**
 * 获取当前脚本执行模式
 * @returns ['LoopQuery', 'Default', 'TranslateJason2Csv']
 */
function queryScriptRunAtMode() {
  let modeStr = queryScriptParams()['mode'] || 'Default'
  modeStr = {
    LoopQuery: 'LoopQuery',
    Default: 'Default',
    TranslateJason2Csv: 'TranslateJason2Csv',
  }[modeStr]
  console.log(`当前脚本运行模式：${modeStr}`);
  return modeStr
}

