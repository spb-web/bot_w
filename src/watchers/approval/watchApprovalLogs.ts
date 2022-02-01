import type { EventFilter } from 'ethers'
import type { Log } from '@ethersproject/abstract-provider'
import type { WebSocketProvider } from '@ethersproject/providers'
import type { ApprovalTokenEvent } from './types'
import type { TokenType } from '@/entries'
import { Observable } from 'rxjs'
import { getEventFilter, parseRawApprovalLog } from './helpers'

export const watchApprovalLogs = (wsProvider:WebSocketProvider, token:TokenType):Observable<ApprovalTokenEvent> => {
  const filter:EventFilter = getEventFilter(token.address)

  const observable = new Observable<ApprovalTokenEvent>((subscriber) => {
    console.debug(`[watchApprovalLogs]: subscribed to token ${token.symbol}`)

    const handleLp = (rawLog:Log) => {
      const lpLog = parseRawApprovalLog(token, rawLog)

      subscriber.next(lpLog)
    }

    wsProvider.on(filter, handleLp)

    return function unsubscribe() {
      wsProvider.off(filter, handleLp)
    }
  })

  return observable
}
