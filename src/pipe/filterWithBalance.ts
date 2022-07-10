import type BigNumber from 'bignumber.js'
import type { BaseTargetEventWithTransactionAndBalance, ProjectEventType } from '@/entries'
import type { AllEvents } from '@/watchers'
import { isLpWithTargetToken } from '@/utils/isLpWithTargetToken'
import { filter } from 'rxjs'
import { isEqualTokens } from '@/utils/isEqualTokens'

export const filterWithBalance = filter<ProjectEventType<BaseTargetEventWithTransactionAndBalance<AllEvents>>>(({ event, priceFetcher, project: { limits, targetToken } }) => {
  switch (event.name) {
    case 'Approval': {
      return (
        event.transaction
        && event.transaction.response?.to === event.token.address
        && (
          event.senderBalance.times(priceFetcher.getPrice()).gte(limits.balanceAlertAmount)
          || event.senderStaked.times(priceFetcher.getPrice()).gte(limits.balanceAlertAmount)
        )
      )
    }

    case 'Mint-LP':
    case 'Burn-LP': {
      return event.eventData.targetAmount.times(priceFetcher.getPrice()).gte(limits.minLpAmountPrice / 2)
    }

    case 'Rewarded':
    case 'Staked':
    case 'Unstaked': {
      const { stakingPool, amount } = event.eventData
      
      if (
        stakingPool.stakingToken.type === 'LP-TOKEN'
        && !isLpWithTargetToken(stakingPool.stakingToken, targetToken)
        && event.name !== 'Rewarded'
      ) {
        return false
      }

      const targetTokenPrice = priceFetcher.getPrice()

      if (event.name === 'Rewarded') {
        return amount.times(targetTokenPrice).gte(limits.rewardAmountPrice)
      }

      const stakingToken = stakingPool.stakingToken
      let stakingTokenPrice:BigNumber

      if (stakingToken.type === 'LP-TOKEN') {
        stakingTokenPrice = priceFetcher.getLpPrice(stakingToken)
      } else if (isEqualTokens(stakingToken, targetToken)) {
        stakingTokenPrice = targetTokenPrice
      } else {
        throw new Error('[filterStakingEvents]: unknow token type')
      }

      return amount.times(stakingTokenPrice).gte(limits.stakeLpAmountPrice)
    }

    case 'Swap': {
      const targetAmountPrice = event.eventData.targetAmount.times(priceFetcher.getPrice())
      
      return (
        targetAmountPrice.gte(limits.minSwapAmountPrice)
        || (
          (event.senderBalance.gte(limits.balanceAlertAmount) || event.senderStaked.gte(limits.balanceAlertAmount))
          && targetAmountPrice.gte(limits.minSwapAmountPriceWithLargeBalance)
        )
      )
    }

    case 'Transfer': {
      return event.eventData.amount.times(priceFetcher.getPrice()).gte(limits.minTransferAmountPrice)
    }
  
    default:
      throw new Error('[telegramMessagePipe]: unknow event name')
  }
})