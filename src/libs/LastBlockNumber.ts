import path from 'path'
import { Storage } from './Storage'

/**
 * key - project name
 * 
 * value - project data
 */
export type BlockDbData = { lastBlock: number }

export class LastBlockNumber extends Storage<BlockDbData> {
  constructor(projectName: string) {
    super(
      path.join(__dirname, `../../runtime/${projectName}/blocksDb.json`),
      {
        type: 'object',
        properties: {
          lastBlock: {type: 'integer'},
        },
        required: ['lastBlock'],
        additionalProperties: false,
      }
    )

    this.readSync()

    if (this.isEmpty) {
      this.setBlockNumber(0)
      this.writeSync()
    }
  }
  
  get lastBlock():number {
    return this.data.lastBlock
  }

  async saveBlockNumber(blockNumber:number):Promise<void> {
    this.setBlockNumber(blockNumber)
    await this.write()
  }

  private setBlockNumber(blockNumber:number) {
    this.checkBlockNumber(blockNumber)

    if (!this.isEmpty && blockNumber <= this.lastBlock) {
      return
    }

    if (this.isEmpty) {
      this.data = { lastBlock: blockNumber }
    }

    if (!(this.data.lastBlock >= blockNumber)) {
      this.data.lastBlock = blockNumber
    }
  }

  private checkBlockNumber(blockNumber:number) {
    if (!Number.isInteger(blockNumber)) {
      throw new Error(`[LastBlockNumber.checkBlockNumber]: blockNumber is not integer ${JSON.stringify(blockNumber)}`,)
    }
  }
}
