import type { Log } from '@ethersproject/abstract-provider'
import type { EventFilter } from 'ethers'
import type { StakingPoolType } from '@/entries'
import type { RewardedEvent, StakedEvent, UnstakedEvent } from './types'
import { id, Interface } from 'ethers/lib/utils'
import { BigNumber } from 'bignumber.js'

const abi = [
  'event Staked(address indexed owner, uint128 amount)',
  'event Unstaked(address indexed from, address indexed to, uint128 amount)',
  'event Rewarded(address indexed from, address indexed to, uint128 amount)',
]

const stakingInterface = new Interface(abi)

export const getEventFilter = (address:string):EventFilter => {
  const filter:EventFilter = {
    address,
    topics: [ 
      [
        id('Staked(address,uint128)'),
        id('Unstaked(address,address,uint128)'),
        id('Rewarded(address,address,uint128)'),
      ]
    ]
  }

  return filter
}

export const parseRawStakingLog = (stakingPool:StakingPoolType, rawLog:Log):StakedEvent|UnstakedEvent|RewardedEvent => {
  const log = stakingInterface.parseLog(rawLog)

  switch (log.name) {
    case 'Staked': {
      const stakedEvent:StakedEvent = {
        name: 'Staked',
        eventData: {
          owner: log.args[0],
          amount: new BigNumber(log.args[1]._hex).div(10**18),
          stakingPool,
        },
        rawLog,
      }

      return stakedEvent
    }

    case 'Unstaked': {
      const stakedEvent:UnstakedEvent = {
        name: 'Unstaked',
        eventData: {
          from: log.args[0],
          to: log.args[1],
          amount: new BigNumber(log.args[2]._hex).div(10**18),
          stakingPool,
        },
        rawLog,
      }

      return stakedEvent
    }

    case 'Rewarded': {
      const stakedEvent:RewardedEvent = {
        name: 'Rewarded',
        eventData: {
          from: log.args[0],
          to: log.args[1],
          amount: new BigNumber(log.args[2]._hex).div(10**18),
          stakingPool,
        },
        rawLog,
      }

      return stakedEvent
    } 
  
    default: {
      throw new Error(`[watchStaking]: Unknow log.name=${JSON.stringify(log.name)}`)
    }
  }
}
