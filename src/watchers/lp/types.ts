import type { PairType } from '@/entries'
import type {BigNumber} from 'bignumber.js'
import type { BaseTargetEvent } from '@/entries'

export type MintLpEvent = Readonly<{
  name: 'Mint',
  sender: string,
  amount0: BigNumber,
  amount1: BigNumber,
  pair: PairType,
}> & BaseTargetEvent

export type BurnLpEvent = Readonly<{
  name: 'Burn',
  sender: string,
  amount0: BigNumber,
  amount1: BigNumber,
  to: string,
  pair: PairType,
}> & BaseTargetEvent
