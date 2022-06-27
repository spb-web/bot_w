import type { BaseProvider } from "@ethersproject/providers";
import path from "path"
import { Storage } from "./Storage";

export class CheckAddress extends Storage<Record<string, boolean>> {
  private provider:BaseProvider

  constructor(provider:BaseProvider) {
    super(
      path.join(__dirname, `../../runtime/isContractDb.json`),
      {
        type: "object",
        patternProperties: {
          "^0x.*$": { type: "boolean" },
        }
      }
    )

    this.provider = provider

    this.readSync()

    if (this.isEmpty) {
      this.data = {}

      this.writeSync()
    }
  }

  public async isContract(address:string) {
    if (Object.hasOwnProperty.call(this.data, address)) {
      return this.data[address]
    } else {
      const code = await this.provider.getCode(address)
      this.data[address] = code !== '0x'

      await this.write()

      return this.data[address]
    }
  }
}
