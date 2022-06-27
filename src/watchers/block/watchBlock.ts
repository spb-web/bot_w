import type { BaseProvider } from '@ethersproject/providers'
import type { Block } from '@ethersproject/abstract-provider'
import { Observable } from 'rxjs'
import { getProvider } from '@/utils/providers/getProvider'

const jsonProvider = getProvider()

export const watchBlock = (provider:BaseProvider):Observable<Block> => {
  const observable = new Observable<Block>((subscriber) => {
    console.debug(`[watchBlock]: subscribed to blocks`)

    const handlePending = async (blockNumber:number) => {
      const block = await jsonProvider.getBlock(blockNumber)
      subscriber.next(block)
    }

    provider.on('block', handlePending);

    return function unsubscribe() {
      provider.off('block', handlePending)
    }
  })

  return observable
}
