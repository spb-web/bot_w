import type { BaseProvider } from '@ethersproject/providers'
import { Observable } from 'rxjs'
import { BlockWithTransactions } from '@ethersproject/abstract-provider'

export const watchBlock = (wsProvider:BaseProvider):Observable<BlockWithTransactions> => {
  const observable = new Observable<BlockWithTransactions>((subscriber) => {
    console.debug(`[watchBlock]: subscribed to blocks`)

    const handlePending = async (blockNumber:number) => {
      const block = await wsProvider.getBlockWithTransactions(blockNumber)
      subscriber.next(block)
    }

    wsProvider.on('block', handlePending);

    return function unsubscribe() {
      wsProvider.off('block', handlePending)
    }
  })

  return observable
}
