import type { ProjectEventType } from '@/entries'
import type { AllEvents } from '@/watchers'
import { pairs, routes } from '@/projects'
import { filter } from 'rxjs'

const routesAddresses = Object.values(routes).map((router) => router.address)
const pairsAddresses = pairs.map((pair) => pair.address)
const excludeTransferAddresses = pairsAddresses.concat(routesAddresses)

export const filterMinimum = filter<ProjectEventType<AllEvents>>(({ event, project: { minLimits, stakingPools } }) => {
  switch (event.name) {
    case 'Approval': {
      return true
    }

    case 'Mint-LP':
    case 'Burn-LP': {
      return event.eventData.targetAmount.gte(minLimits.minLpAmount)
    }

    case 'Rewarded': {
      return event.eventData.amount.gte(minLimits.rewardAmount)
    }

    case 'Staked': {
      return event.eventData.amount.gte(minLimits.stakeLpAmount)
    }

    case 'Unstaked': {
      return event.eventData.amount.gte(minLimits.stakeLpAmount)
    }

    case 'Swap': {
      return event.eventData.targetAmount.gte(minLimits.minSwapAmount)
    }

    case 'Transfer': {
      return (
        event.eventData.amount.gte(minLimits.minTransferAmount)
        && !excludeTransferAddresses.includes(event.eventData.to)
        && !excludeTransferAddresses.includes(event.eventData.from)
        && stakingPools.every((pool) => pool.address !== event.eventData.to && pool.address !== event.eventData.from)
      );
    }
  
    default:
      throw new Error('[telegramMessagePipe]: unknow event name')
  }
})
