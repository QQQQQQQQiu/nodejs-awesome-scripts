import {request} from './utils/request.js'
import {isHasFile, readFileByObj, writeFileObj, writeFileOther, writeFileStr} from './utils/文件操作.js'
import {select} from './utils/询问输入.js'
import {exit} from './utils/工具.js'
import {parseAsync, transforms} from 'json2csv'


async function main() {
  let text = await request('GET', 'https://weibo.com/ajax/side/hotSearch')
  let resObj = JSON.parse(text)
  let hotArr = resObj.data.realtime.reduce((result, item) => {
    if (item.is_ad) return result
    let obj = {
      word: item.word,
      word_scheme: item.word_scheme,
      num: item.num,
      category: item.category,
      note: item.note,
    }
    result.push(obj)
    return result
  }, [])
  let hotData = {
    recordTime: +new Date() + '',
    hotArr
  }
  let fileInnerData = []
  const filePath = './temp/hotSearch.json'
  if (await isHasFile(filePath)) {
    fileInnerData = await readFileByObj(filePath)
    console.log(`文件已存在，内置数据${fileInnerData.length}条`);
  }
  fileInnerData.push(hotData)
  await writeFileObj(filePath, fileInnerData)
  console.log(`${new Date().toLocaleString()}热搜数据保存完成，文件：${filePath} \n`);
  let y_n = await select('是否需要生成csv表格文件？', [{label: '是', value: 'y'}, {label: '否', value: 'n'}])
  if (y_n === 'n') {
    exit()
  }
  const csvFields = ['recordTime', 'hotArr.word', 'hotArr.word_scheme', 'hotArr.num', 'hotArr.category', 'hotArr.note'];
  const csvPaths = [transforms.unwind({ paths: ['hotArr'], blankOut: true })];
  const csvInnerStr = await parseAsync(fileInnerData,{
    fields:csvFields,
    transforms:csvPaths
  });
  await writeFileStr(`./temp/hotSearch.csv`, csvInnerStr)
  console.log(`csv文件保存完成，文件：./temp/hotSearch.csv`);
  exit()
}

main()