import type { Log } from '@ethersproject/abstract-provider'
import type { BaseProvider } from '@ethersproject/providers'
import type { BigNumber } from 'bignumber.js'
import type { TransactionData } from './fetch/fetchTransaction'
import type { TargetPriceFetcher } from './libs/TargetPriceFetcher'
import type { TgBot } from './libs/TgBot'

export enum StakingContractType {
  MULTY_CONTRCATS,
  MULTY_CONTRCATS_AUTO,
  MASTER_CHEF_V1,
  MASTER_CHEF_V2,
}

export type BaseToken = {
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
  contractType: StakingContractType,
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
  rawLog: Log,
}>

export type AddressInfoType = {
  isContract: boolean
}

export type BaseTargetEventWithTransaction<E extends BaseTargetEvent> = E & Readonly<{
  transaction: TransactionData
  addressesInfo: Record<string, AddressInfoType>,
}>

export type BaseTargetEventWithTransactionAndBalance<E extends BaseTargetEvent> = BaseTargetEventWithTransaction<E> & Readonly<{
  senderBalance: BigNumber,
  senderStaked: BigNumber,
}>

export type TelegramConfigType = Readonly<{
  whalesChatId: string,
  publicWhalesChatId: string,
  botToken: string,
}>

export type ProjectLimitsType = Readonly<{
  minTransferAmountPrice: number,
  minSwapAmountPrice: number,
  minSwapAmountPriceWithLargeBalance: number,
  minLpAmountPrice: number,
  rewardAmountPrice: number,
  stakeLpAmountPrice: number,
  /**
   * Если баланс пользователя больше этого значения, то помечаем сообщение как важное
   */
  balanceAlertAmount: number,
}>

export type ProjectMinLimitsType = Readonly<{
  minTransferAmount: number,
  minSwapAmount: number,
  minLpAmount: number,
  rewardAmount: number,
  stakeLpAmount: number,
}>

export type ProjectType = Readonly<{
  name: Readonly<string>,
  lpTokens: Readonly<Record<string, Readonly<Record<string, PairType>>>>,
  stakingPools:ReadonlyArray<StakingPoolType>,
  targetToken: TokenType,
  telegram: TelegramConfigType,
  limits: ProjectLimitsType,
  publicLimits: ProjectLimitsType,
  minLimits: ProjectMinLimitsType,
}>

export type ProjectEventType<E extends BaseTargetEvent> = {
  project: ProjectType,
  provider: BaseProvider,
  tgBot: TgBot,
  event: E,
  priceFetcher: TargetPriceFetcher,
}