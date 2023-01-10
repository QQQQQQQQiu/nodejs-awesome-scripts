import {createInterface} from 'node:readline/promises'

let rl = null
export async function question(title = '') {
  let answer = ''
  if (!rl) {
    rl = createInterface({
      input: process.stdin,
      output: process.stdout
    })
  }
  while (!answer.trim()) {
      answer = await rl.question(title);
  }
  return answer
}