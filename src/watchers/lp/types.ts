import type { PairType } from '@/entries'
import type {BigNumber} from 'bignumber.js'
import type { BaseTargetEvent } from '@/entries'

export type MintLpEvent = Readonly<{
  name: 'Mint-LP',
  eventData: {
    sender: string,
    amount0: BigNumber,
    amount1: BigNumber,
    pairedAmount: BigNumber,
    targetAmount: BigNumber,
    pair: PairType,
  }
}> & BaseTargetEvent

export type BurnLpEvent = Readonly<{
  name: 'Burn-LP',
  eventData: {
    sender: string,
    amount0: BigNumber,
    amount1: BigNumber,
    pairedAmount: BigNumber,
    targetAmount: BigNumber,
    to: string,
    pair: PairType,
  }
}> & BaseTargetEvent
