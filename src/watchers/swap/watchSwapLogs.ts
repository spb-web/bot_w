import type { BaseTargetEvent, PairType } from '@/entries'
import type { Log } from '@ethersproject/abstract-provider'
import type { EventFilter } from 'ethers'
import type { BaseProvider } from '@ethersproject/providers'
import { Observable } from 'rxjs'
import { BigNumber } from 'bignumber.js'
import { id, Interface } from 'ethers/lib/utils'

const abi = [
  'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)'
]

const pairInterface = new Interface(abi)

export type SwapEvent = Readonly<{
  name: 'Swap',
  sender: string,
  amount0In: BigNumber,
  amount1In: BigNumber,
  amount0Out: BigNumber,
  amount1Out: BigNumber,
  to: string,
  pair: PairType,
}> & BaseTargetEvent

export const watchSwapLog = (wsProvider:BaseProvider, pair:PairType):Observable<SwapEvent> => {
  const filter:EventFilter = {
    address: pair.address,
    topics: [ id('Swap(address,uint256,uint256,uint256,uint256,address)') ]
  }

  const observable = new Observable<SwapEvent>((subscriber) => {
    const handleSwap = async (rawLog:Log) => {
      const log = pairInterface.parseLog(rawLog)
      const amount0InBn = new BigNumber(log.args[1]._hex).div(10**18)
      const amount1InBn = new BigNumber(log.args[2]._hex).div(10**18)
      const amount0OutBn = new BigNumber(log.args[3]._hex).div(10**18)
      const amount1OutBn = new BigNumber(log.args[4]._hex).div(10**18)

      const swapLog:SwapEvent = {
        name: 'Swap',
        sender: log.args[0],
        amount0In: amount0InBn,
        amount1In: amount1InBn,
        amount0Out: amount0OutBn,
        amount1Out: amount1OutBn,
        to: log.args[5],
        pair,
        rawLog,
      }

      subscriber.next(swapLog)
    }
    
    wsProvider.on(filter, handleSwap)

    return function unsubscribe() {
      wsProvider.off(filter, handleSwap)
    }
  })

  return observable
}
