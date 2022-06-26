import type { BigNumber as EthersBigNumber } from 'ethers'
import type { PairType } from '@/entries'
import { targetToken } from '../projects'
import asyncRetry from 'async-retry'
import { BigNumber } from 'bignumber.js'
import { targetPriceFetcher } from '../libs/TargetPriceFetcher'
import multicall, { Call } from '../utils/multicall'
import pairAbi from '../config/abi/pairAbi.json'
import { isLpWithTargetToken } from '../utils/isLpWithTargetToken'

const TEN_BN = new BigNumber(10)

export const fetchLpPrice = (pair:PairType):Promise<BigNumber> => {
  if (!isLpWithTargetToken(pair)) {
    throw new Error('[fetchLpPrice]')
  }

  return asyncRetry(async () => {
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
  
    const targetPrice = targetPriceFetcher.getPrice()
    const token0Amount = new BigNumber(rawReserves[0]._hex).div(TEN_BN.pow(pair.token0.decimals))
    const token1Amount = new BigNumber(rawReserves[1]._hex).div(TEN_BN.pow(pair.token1.decimals))
    const totalSupply = new BigNumber(rawTotalSypply._hex).div(TEN_BN.pow(pair.decimals))
  
    if (pair.token0.address === targetToken.address) {
      return token0Amount.times(targetPrice).times(2).div(totalSupply)
    }
  
    return token1Amount.times(targetPrice).times(2).div(totalSupply)  
  }, {
    retries: 5,
    minTimeout: 500,
  })
}
