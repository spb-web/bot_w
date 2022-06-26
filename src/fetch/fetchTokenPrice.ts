import type { TokenType } from '@/entries'
import { BigNumber as EthersBigNumber } from 'ethers'
import { BigNumber } from 'bignumber.js'
import asyncRetry from 'async-retry'
import multicall, { Call } from '../utils/multicall'
import pairAbi from '../config/abi/pairAbi.json'
import { getTokenPriceRoute } from '../utils/getTokenPriceRoute'

const TEN_BN = new BigNumber(10)

export const fetchTokenPrice = (token:TokenType):Promise<BigNumber> => {
  return asyncRetry(async () => {
    const path = getTokenPriceRoute(token)

    const calls:Call[] = path.map((pair):Call => ({
      address: pair.address, // Address of the contract
      name: 'getReserves', // Function name on the contract (example: balanceOf)
    }))
  
    const allReserves = await multicall<EthersBigNumber[][]>(pairAbi, calls)
  
    const { price: tokenPrice } = allReserves.reduce(({ price, token }, reserves, index) => {
      const pair = path[index]
      const [ token0Amount, token1Amount ] = [
        new BigNumber(reserves[0]._hex).div(TEN_BN.pow(pair.token0.decimals)),
        new BigNumber(reserves[1]._hex).div(TEN_BN.pow(pair.token0.decimals)),
      ]
  
      if (pair.token0.address === token.address) {
        return { price: price.times(token1Amount.div(token0Amount)), token: pair.token1 }
      }
  
      return { price: price.times(token0Amount.div(token1Amount)), token: pair.token1 }
    }, { price: new BigNumber(1), token })
  
    return tokenPrice
  }, {
    retries: 5,
    minTimeout: 500,
  })
}
