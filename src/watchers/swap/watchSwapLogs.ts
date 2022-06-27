import type { PairType } from '@/entries'
import type { Log } from '@ethersproject/abstract-provider'
import type { EventFilter } from 'ethers'
import type { BaseProvider } from '@ethersproject/providers'
import type { SwapEvent } from './types'
import { Observable } from 'rxjs'
import { getEventFilter, parseRawSwapLog } from './helpers'

export const watchSwapLog = (wsProvider:BaseProvider, pair:PairType):Observable<SwapEvent> => {
  const filter:EventFilter = getEventFilter(pair.address)

  const observable = new Observable<SwapEvent>((subscriber) => {
    const handleSwap = (rawLog:Log) => {
      const swapLog = parseRawSwapLog(pair, rawLog)

      subscriber.next(swapLog)
    }
    
    wsProvider.on(filter, handleSwap)

    return function unsubscribe() {
      wsProvider.off(filter, handleSwap)
    }
  })

  return observable
}
