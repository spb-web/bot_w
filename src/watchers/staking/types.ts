import type { BaseTargetEvent, StakingPoolType } from '@/entries'
import type BigNumber from 'bignumber.js'

export type StakedEvent = Readonly<{
  name: 'Staked',
  owner: string,
  amount: BigNumber,
  stakingPool: StakingPoolType,
}> & BaseTargetEvent

export type UnstakedEvent = Readonly<{
  name: 'Unstaked',
  from: string,
  amount: BigNumber,
  to: string,
  stakingPool: StakingPoolType,
}> & BaseTargetEvent

export type RewardedEvent = Readonly<{
  name: 'Rewarded',
  from: string,
  amount: BigNumber,
  to: string,
  stakingPool: StakingPoolType,
}> & BaseTargetEvent
