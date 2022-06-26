import type { BaseTargetEvent, StakingPoolType } from '@/entries'
import type { BigNumber } from 'bignumber.js'

export type StakedEvent = Readonly<{
  name: 'Staked',
  eventData: {
    owner: string,
    amount: BigNumber,
    stakingPool: StakingPoolType,
  },
}> & BaseTargetEvent

export type UnstakedEvent = Readonly<{
  name: 'Unstaked',
  eventData: {
    from: string,
    amount: BigNumber,
    to: string,
    stakingPool: StakingPoolType,
  }
}> & BaseTargetEvent

export type RewardedEvent = Readonly<{
  name: 'Rewarded',
  eventData: {
    from: string,
    amount: BigNumber,
    to: string,
    stakingPool: StakingPoolType,
  }
}> & BaseTargetEvent
