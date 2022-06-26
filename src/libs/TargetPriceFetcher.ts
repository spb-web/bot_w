import type { PairType } from '@/entries'
import { BigNumber } from 'bignumber.js'
import { targetToken } from '../projects'
import { fetchLpPrice } from '../fetch/fetchLpPrice'
import { fetchTokenPrice } from '../fetch/fetchTokenPrice'
import { getTokenPriceRoute } from '../utils/getTokenPriceRoute'
import { isLpWithTargetToken } from '../utils/isLpWithTargetToken'
import { SwapEvent } from '../watchers'

export class TargetPriceFetcher {
  private price = new BigNumber(0)
  private lpPrices:Record<string, BigNumber> = {}
  private path = getTokenPriceRoute(targetToken)

  public handleSwapLog:(event:SwapEvent) => Promise<void>

  constructor() {
    this.handleSwapLog = async (event:SwapEvent) => {
      const promises:Promise<void>[] = []

      if (this.path.some(pair => pair.address === event.pair.address)) {
        promises.push(this.fetchPrice())
      }

      if (isLpWithTargetToken(event.pair)) {
        promises.push(this.fetchLpPrice(event.pair))
      }

      await Promise.all(promises)
    }
  }

  public async fetchPrice() {
    console.debug(`[TargetPriceFetcher.fetchPrice]: updating price`)
    this.price = await fetchTokenPrice(targetToken)
    console.debug(`[TargetPriceFetcher.fetchPrice]: price updated ${this.price.toString()}`)
  }

  public async fetchLpPrice(pair:PairType) {
    console.debug(`[TargetPriceFetcher.fetchLpPrice]: updating price ${pair.symbol}`)
    this.lpPrices[pair.address] = await fetchLpPrice(pair)
    console.debug(`[TargetPriceFetcher.fetchLpPrice]: price updated 1 ${pair.symbol} = ${this.lpPrices[pair.address].toString()}`)
  }

  public async fetchLpPriceAll(pairs:PairType[]) {
    for (let index = 0; index < pairs.length; index++) {
      await this.fetchLpPrice(pairs[index]) 
    }
  }

  public getPrice() {
    return this.price
  }

  public getLpPrice(pair:PairType) {
    const price = this.lpPrices[pair.address]

    if (!price) {
      throw new Error("")
    }

    return price
  }
}

export const targetPriceFetcher = new TargetPriceFetcher()
