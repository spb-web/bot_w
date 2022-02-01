import { TransactionResponse } from '@ethersproject/abstract-provider'
import asyncRetry from 'async-retry'
import { getProvider } from '../utils/providers/getProvider'

const provider = getProvider()

export type TransactionData = {
  response: TransactionResponse|null
}

export const fetchTransaction = async (hash:string):Promise<TransactionData> => {
  return asyncRetry(async () => {
    const transactionResponse = await provider.getTransaction(hash)

    return {
      response: transactionResponse
    }
  }, {
    retries: 5,
    minTimeout: 500,
  })
}
