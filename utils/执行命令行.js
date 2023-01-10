import { exec as execOld, spawn } from 'node:child_process'
import {promisify} from 'node:util'
const exec = promisify(execOld)

export async function command(str) {
  return await exec(`${str}`)
}
