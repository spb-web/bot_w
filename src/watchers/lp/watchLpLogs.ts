import type { EventFilter } from 'ethers'
import type { Log } from '@ethersproject/abstract-provider'
import type { WebSocketProvider } from '@ethersproject/providers'
import type { BurnLpEvent, MintLpEvent } from './types'
import type { PairType } from '@/entries'
import { Observable } from 'rxjs'
import { getEventFilter, parseRawLpLog } from './helpers'

export const watchLpLogs = (wsProvider:WebSocketProvider, pair:PairType):Observable<MintLpEvent|BurnLpEvent> => {
  const filter:EventFilter = getEventFilter(pair.address)

  const observable = new Observable<MintLpEvent|BurnLpEvent>((subscriber) => {
    console.debug(`[watchLpLogs]: subscribed to pair ${pair.address}`)

    const handleLp = (rawLog:Log) => {
      const lpLog = parseRawLpLog(pair, rawLog)

      subscriber.next(lpLog)
    }

    wsProvider.on(filter, handleLp)

    return function unsubscribe() {
      wsProvider.off(filter, handleLp)
    }
  })

  return observable
}
