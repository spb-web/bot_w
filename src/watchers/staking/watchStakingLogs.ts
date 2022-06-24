import type { EventFilter } from 'ethers'
import type { Log } from '@ethersproject/abstract-provider'
import type { StakingPoolType } from '@/entries'
import type { BaseProvider } from '@ethersproject/providers'
import type { RewardedEvent, StakedEvent, UnstakedEvent } from './types'
import { Observable } from 'rxjs'
import { getEventFilter, parseRawStakingLog } from './helpers'

export const watchStakingLogs = (wsProvider:BaseProvider, stakingPool:StakingPoolType) => {
  const filter:EventFilter = getEventFilter(stakingPool.address)

  const observable = new Observable<StakedEvent|UnstakedEvent|RewardedEvent>((subscriber) => {
    console.debug(`[watchStaking]: subscribed to staking service ${stakingPool.address} ${stakingPool.name}`)

    const handleStaking = (rawLog:Log) => {
      const log = parseRawStakingLog(stakingPool, rawLog)

      subscriber.next(log)
    }
    
    wsProvider.on(filter, handleStaking)

    return function unsubscribe() {
      wsProvider.off(filter, handleStaking)
    }
  })

  return observable
}
