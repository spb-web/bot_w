import type { Log } from '@ethersproject/abstract-provider'
import type { EventFilter } from 'ethers'
import type { BaseTargetEvent, TokenType } from '@/entries'
import type { BaseProvider } from '@ethersproject/providers'
import { BigNumber } from 'bignumber.js'
import { id, Interface } from 'ethers/lib/utils'
import { Observable } from 'rxjs'

const abi = [
  "event Transfer(address indexed src, address indexed dst, uint val)"
]

const nmxInterface = new Interface(abi)

export type TransferEvent = Readonly<{
  name: 'Transfer',
  from: string,
  to: string,
  amount: BigNumber,
  token: TokenType,
}> & BaseTargetEvent

export const watchTransfers = (wsProvider:BaseProvider, token:TokenType) => {
  const filter:EventFilter = {
    address: token.address,
    topics: [ id('Transfer(address,address,uint256)') ],
  }

  const observable = new Observable<TransferEvent>((subscriber) => {
    console.debug(`[watchTransfers]: subscribed to ${token.address}`)

    const handleTransfer = (rawLog:Log) => {
      const log = nmxInterface.parseLog(rawLog)
      const amountBn = new BigNumber(log.args[2]._hex)
  
      const transferEvent:TransferEvent = {
        name: 'Transfer',
        from: log.args[0],
        to: log.args[1],
        amount: amountBn.div(10**token.decimals),
        token,
        rawLog,
      }

      subscriber.next(transferEvent)
    }

    wsProvider.on(filter, handleTransfer)

    return function unsubscribe() {
			wsProvider.off(filter, handleTransfer)
		}
  })

  return observable
}
