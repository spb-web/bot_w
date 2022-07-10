import type { AddressInfoType, BaseTargetEvent, BaseTargetEventWithTransactionAndBalance, ProjectEventType } from '@/entries'
import { fetchTransaction } from '../fetch/fetchTransaction'
import { fetchTargetTokenBalance } from '../fetch/fetchTargetTokenBalance'
import { BigNumber } from 'bignumber.js'
import { getProvider } from '@/utils/providers/getProvider'
import { CheckAddress } from '../libs/CheckAddress'
import { mergeMap } from 'rxjs'

const provider = getProvider()
const checkAddress = new CheckAddress(provider)

export const addTransactionPipe = mergeMap(
  async <E extends BaseTargetEvent>(projectEvent:ProjectEventType<E>):Promise<ProjectEventType<BaseTargetEventWithTransactionAndBalance<E>>> => {
    const transaction = await fetchTransaction(projectEvent.event.rawLog.transactionHash)
    const addresses = new Set<string>()

    if (transaction.response?.from) {
      addresses.add(transaction.response.from)
    }

    if (transaction.response?.to) {
      addresses.add(transaction.response.to)
    }

    const addressesInfo: Record<string, AddressInfoType> = {}
    
    const promisses = Array.from(addresses).map(
      async (address) => {
        addressesInfo[address] = {
          isContract: await checkAddress.isContract(address)
        }
        return addressesInfo
      }
    )

    await Promise.all(promisses)

    const senderTokensAmount = transaction.response?.from ? 
      await fetchTargetTokenBalance(projectEvent.project, transaction.response.from)
      : null

    return {
      ...projectEvent,
      event: {
        ...projectEvent.event,
        addressesInfo,
        transaction,
        senderBalance: senderTokensAmount?.balance ?? new BigNumber(-1),
        senderStaked: senderTokensAmount?.staked ?? new BigNumber(-1),
      },
    }
  }
)
