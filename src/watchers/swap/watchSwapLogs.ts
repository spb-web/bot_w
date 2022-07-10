import type { PairType, ProjectType } from '@/entries'
import type { Log } from '@ethersproject/abstract-provider'
import type { EventFilter } from 'ethers'
import type { BaseProvider } from '@ethersproject/providers'
import type { SwapEvent } from './types'
import { Observable } from 'rxjs'
import { getEventFilter, parseRawSwapLog } from './helpers'

export const watchSwapLog = (provider:BaseProvider, project: ProjectType, pair:PairType):Observable<SwapEvent> => {
  const filter:EventFilter = getEventFilter(pair.address)

  const observable = new Observable<SwapEvent>((subscriber) => {
    console.debug(`[watchSwapLog]: subscribed to pair ${pair.address}`)

    const handleSwap = (rawLog:Log) => {
      const swapLog = parseRawSwapLog(project, pair, rawLog)

      subscriber.next(swapLog)
    }
    
    provider.on(filter, handleSwap)

    return function unsubscribe() {
      provider.off(filter, handleSwap)
    }
  })

  return observable
}
