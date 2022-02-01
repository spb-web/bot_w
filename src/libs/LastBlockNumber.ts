import { existsSync, readFileSync } from 'fs'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export class LastBlockNumber {
  private blockNumber:number
  private filePath:string

  constructor(filePath:string, minBlockNumber = 0) {
    this.filePath = filePath

    if (existsSync(this.filePath)) {
      const blockNumber = parseInt(readFileSync(this.filePath).toString(), 10)
      this.checkBlockNumber(blockNumber)
  
      this.blockNumber = Math.max(minBlockNumber, blockNumber)
    } else {
      this.blockNumber = minBlockNumber
    }
  }
  
  get():number {
    return this.blockNumber
  }

  async processBlockNumber(blockNumber:number):Promise<void> {
    this.checkBlockNumber(blockNumber)

    if (blockNumber <= this.blockNumber) {
      return
    }

    this.blockNumber = blockNumber

    await writeFile(this.filePath, blockNumber.toString())
  }

  private checkBlockNumber(blockNumber:number) {
    if (!Number.isInteger(blockNumber)) {
      throw new Error(`[LastBlockNumber.checkBlockNumber]: blockNumber is not integer ${JSON.stringify(blockNumber)}`,)
    }
  }
}

export const lastBlockNumber = new LastBlockNumber(join(__dirname, '../../runtime/blockNumber'), 1000)
