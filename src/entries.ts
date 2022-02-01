import type { Log } from '@ethersproject/abstract-provider'
import type BigNumber from 'bignumber.js'
import type { TransactionData } from './fetch/fetchTransaction'

type BaseToken = {
  address: string,
  symbol: string,
  decimals: number,
}

export type TokenType = Readonly<{
  type: 'TOKEN',
} & BaseToken>

export type PairType = Readonly<{
  token0: TokenType,
  token1: TokenType,
  exchangeName: string,
  symbol: string,
  type: 'LP-TOKEN',
} & BaseToken>

export type StakingPoolType = Readonly<{
  address: string,
  stakingToken: TokenType|PairType,
  earningToken: TokenType,
  exchangeName: string,
  name: string,
}>

export type RouterType = Readonly<{
  address: string,
  exchangeName: string,
}>

export type BaseTargetEvent = Readonly<{
  rawLog: Log
}>

export type BaseTargetEventWithTransaction<E extends BaseTargetEvent> = E & Readonly<{
  transaction: TransactionData
}>

export type BaseTargetEventWithTransactionAndBalance<E extends BaseTargetEvent> = BaseTargetEventWithTransaction<E> & Readonly<{
  senderBalance: BigNumber,
  senderStaked: BigNumber,
}>
