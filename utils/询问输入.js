import {createInterface} from 'node:readline/promises'
let readlineInstance = null
function getReadlineInstance() {
  if (!readlineInstance) {
    readlineInstance = createInterface({
      input: process.stdin,
      output: process.stdout
    })
  }
  return readlineInstance
}
export async function question(title = '') {
  let answer = ''
  let readlineInstance = getReadlineInstance()
  while (!answer.trim()) {
      answer = await readlineInstance.question(title);
  }
  return answer
}

export async function select(title = '', options = [{label: '', value: ''}]) {
  let answer = ''
  let valueArr = options.map(({value})=>value)
  
  let str = `${title}（${valueArr.join('/')}）\n${options.map(({label,value})=>`${value}：${label}\n`).join('')}\n`
  while (!valueArr.includes(answer)) {
    answer = (await question(str)).trim()
  }
  return answer
}
