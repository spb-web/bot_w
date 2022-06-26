import { readFileSync } from 'fs'
import Ajv, { ValidateFunction } from 'ajv'
import { ensureFileSync, writeJSON, writeJSONSync } from 'fs-extra'
import { readFile } from 'fs/promises'

const ajv: Ajv = new Ajv()

export class Storage<T> {
  private _data: T|null = null
  private path: string
  private validate:ValidateFunction<T>

  constructor(path:string, schema:any = {}) {
    this.path = path
    this.validate = ajv.compile<T>(schema)

    ensureFileSync(path)
  }

  get isEmpty():boolean {
    return this._data === null
  }

  get data():T {
    if (this._data === null) {
      throw new Error('[Storage]: Data is null. Please, write new data or run Storage.read() before getting data')
    }
  
    return this._data
  }

  set data(val:T) {
    this._data = val
    this.validateAndThrowError(val)
  }

  private validateAndThrowError(val:T) {
    const isValid = this.validate(val)
    
    if (!isValid) {
      throw new Error(`[Storage.validateAndThrowError]: invalid Data.\n ${this.validate.errors?.join('\n')}`)
    }
  }

  public async read() {
    const dataRaw = await readFile(this.path, { encoding: 'utf-8' })
    this.setRawData(dataRaw)
  }

  public readSync() {
    const dataRaw = readFileSync(this.path, { encoding: 'utf-8' })
    this.setRawData(dataRaw)
  }

  public async write() {
    await writeJSON(this.path, this._data, { encoding: 'utf-8' })
  }

  public writeSync() {
    writeJSONSync(this.path, this._data, { encoding: 'utf-8' })
  }

  private setRawData(dataRaw:string) {
    let data:T|null

    try {
      data = JSON.parse(dataRaw)
    } catch (error) {
      data = null
    }

    this._data = data
  }
}
