import type { BaseTargetEvent, BaseTargetEventWithTransactionAndBalance } from '@/entries'
import { fetchTransaction } from './fetch/fetchTransaction'
import { fetchTargetTokenBalance } from './fetch/fetchTargetTokenBalance'
import { BigNumber } from 'bignumber.js'

export const addTransaction = async <E extends BaseTargetEvent>(event:E):Promise<BaseTargetEventWithTransactionAndBalance<E>> => {
  const transaction = await fetchTransaction(event.rawLog.transactionHash)
  const senderTokensAmount = transaction.response?.from ? 
    await fetchTargetTokenBalance(transaction.response.from)
    : null

  return {
    ...event,
    addressesInfo: {

    },
    transaction,
    senderBalance: senderTokensAmount?.balance ?? new BigNumber(-1),
    senderStaked: senderTokensAmount?.staked ?? new BigNumber(-1),
  }
} 