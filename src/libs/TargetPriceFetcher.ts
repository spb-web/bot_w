import type { PairType, TokenType } from '@/entries'
import type { BigNumber as EthersBigNumber } from 'ethers'
import type { SwapEvent } from '@/watchers'
import pairAbi from '@/config/abi/pairAbi.json'
import { isEqualTokens } from '@/utils/isEqualTokens'
import multicall, { Call } from '@/utils/multicall'
import AsyncRetry from 'async-retry'
import { BigNumber } from 'bignumber.js'
import { fetchTokenPrice } from '@/fetch/fetchTokenPrice'
import { getTokenPriceRoute } from '@/utils/getTokenPriceRoute'
import { isLpWithTargetToken } from '@/utils/isLpWithTargetToken'

const TEN_BN = new BigNumber(10)

export class TargetPriceFetcher {
  private price = new BigNumber(0)
  private lpPrices: Record<string, BigNumber> = {}
  private targetToken: TokenType
  private path: PairType[]
  private pairs: PairType[]

  public handleSwapLog:(event: SwapEvent) => Promise<void>

  constructor(targetToken: TokenType, pairs: PairType[]) {
    this.targetToken = targetToken
    this.pairs = pairs
    this.path = getTokenPriceRoute(targetToken)
    this.handleSwapLog = async (event:SwapEvent) => {
      const promises:Promise<void>[] = []

      if (this.path.some(pair => pair.address === event.eventData.pair.address)) {
        promises.push(this.fetchPrice())
      }

      if (isLpWithTargetToken(event.eventData.pair, targetToken)) {
        promises.push(this.fetchLpPrice(event.eventData.pair))
      }

      await Promise.all(promises)
    }
  }

  public async fetchPrice() {
    console.debug(`[TargetPriceFetcher.fetchPrice]: updating price`)
    this.price = await fetchTokenPrice(this.targetToken)
    console.debug(`[TargetPriceFetcher.fetchPrice]: price updated ${this.price.toString()}`)
  }

  public async fetchLpPriceAll() {
    for (let index = 0; index < this.pairs.length; index++) {
      await this.fetchLpPrice(this.pairs[index]) 
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

  public async fetchLpPrice(pair:PairType) {
    console.debug(`[TargetPriceFetcher.fetchLpPrice]: updating price ${pair.symbol}`)

    if (!isLpWithTargetToken(pair, this.targetToken)) {
      throw new Error('[fetchLpPrice]')
    }
  
    return AsyncRetry(async () => {
      const calls:Call[] = [
        {
          address: pair.address,
          name: 'getReserves',
        },
        {
          address: pair.address,
          name: 'totalSupply',
        }
      ]
    
      const [rawReserves, [rawTotalSypply]] = await multicall<[EthersBigNumber[], [EthersBigNumber]]>(pairAbi, calls)
    
      let price:BigNumber
      const targetPrice = this.getPrice()
      const token0Amount = new BigNumber(rawReserves[0]._hex).div(TEN_BN.pow(pair.token0.decimals))
      const token1Amount = new BigNumber(rawReserves[1]._hex).div(TEN_BN.pow(pair.token1.decimals))
      const totalSupply = new BigNumber(rawTotalSypply._hex).div(TEN_BN.pow(pair.decimals))
    
      if (isEqualTokens(pair.token0, this.targetToken)) {
        price = token0Amount.times(targetPrice).times(2).div(totalSupply)
      } else {
        price = token1Amount.times(targetPrice).times(2).div(totalSupply)  
      }

      this.lpPrices[pair.address] = price

      console.debug(`[TargetPriceFetcher.fetchLpPrice]: price updated 1 ${pair.symbol} = ${this.lpPrices[pair.address].toString()}`)
    }, {
      retries: 5,
      minTimeout: 500,
    })
  } 
}
