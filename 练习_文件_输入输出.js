import {question} from './utils/询问输入.js'
import {isHasFile, writeFileStr, readFileByStr} from './utils/文件操作.js'

async function init(params) {
    let fileName = await question('新建txt文件名：')
    let txtStr = ''
    if (await isHasFile(`./temp/${fileName}.txt`)) {
        txtStr = await readFileByStr(`./temp/${fileName}.txt`)
        console.log(`./temp/${fileName}.txt 已存在，内容为\n${txtStr}`)
        let yesNo = ''
        while (!['y', 'n'].includes(yesNo)) {
            yesNo = (await question('是否覆盖？y/n：')).trim()
        }
        if (yesNo === 'n') {
            console.log('n：完毕');
            process.exit(0);
        }
    }
    txtStr = await question('请输入文件内容：')
    await writeFileStr(`./temp/${fileName}.txt`, txtStr)
    console.log(`./temp/${fileName}.txt 已建立，内容为\n`, await readFileByStr(`./temp/${fileName}.txt`))
    process.exit(0);
}

init()