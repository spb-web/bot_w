import type { EventFilter } from 'ethers'
import type { Log } from '@ethersproject/abstract-provider'
import type { BaseProvider } from '@ethersproject/providers'
import type { BurnLpEvent, MintLpEvent } from './types'
import type { PairType, ProjectType } from '@/entries'
import { Observable } from 'rxjs'
import { getEventFilter, parseRawLpLog } from './helpers'

export const watchLpLogs = (provider:BaseProvider, project: ProjectType, pair:PairType):Observable<MintLpEvent|BurnLpEvent> => {
  const filter:EventFilter = getEventFilter(pair.address)

  const observable = new Observable<MintLpEvent|BurnLpEvent>((subscriber) => {
    console.debug(`[watchLpLogs]: subscribed to pair ${pair.address}`)

    const handleLp = (rawLog:Log) => {
      const lpLog = parseRawLpLog(project, pair, rawLog)

      subscriber.next(lpLog)
    }

    provider.on(filter, handleLp)

    return function unsubscribe() {
      provider.off(filter, handleLp)
    }
  })

  return observable
}
