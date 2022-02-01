import type { SwapEvent, TransferEvent, BurnLpEvent, MintLpEvent, StakedEvent, UnstakedEvent, RewardedEvent } from './watchers'
import type { BaseTargetEventWithTransactionAndBalance } from './entries'
import BigNumber from 'bignumber.js'
import { filter } from 'rxjs'
import { balanceAlertAmount, minLpAmountPrice, minSwapAmountPrice, minSwapAmountPriceWithLargeBalance, minTransferAmountPrice, rewardAmountPrice, stakeLpAmountPrice } from './config/constants/limits'
import { pairs } from './config/pairs'
import { routes } from './config/routes'
import { stakingPools } from './config/stakingPools'
import { targetToken } from './config/tokens'
import { targetPriceFetcher } from './libs/TargetPriceFetcher'
import { ApprovalTokenEvent } from './watchers/approval'

const pairsAddresses = pairs.map((pair) => pair.address)
const stakingPoolsAddresses = stakingPools.map((stakingPool) => stakingPool.address)
const routesAddresses = Object.values(routes).map((router) => router.address)
const excludeTransferAddresses = pairsAddresses.concat(stakingPoolsAddresses, routesAddresses)

export const transfersFilter = filter<TransferEvent>(
  (transferEvent) => {
    const targetTokenPrice = targetPriceFetcher.getPrice()

    return (
      !pairsAddresses.includes(transferEvent.from)
      && !excludeTransferAddresses.includes(transferEvent.to)
      && !excludeTransferAddresses.includes(transferEvent.from)
      && transferEvent.amount.times(targetTokenPrice).gte(minTransferAmountPrice)
    )
  }
)

export const filterSwapLogs = filter<BaseTargetEventWithTransactionAndBalance<SwapEvent>>(
  (event) => {
    const targetTokenPrice = targetPriceFetcher.getPrice()

    return (
      event.pair.token0.address === targetToken.address
        ? event.amount0In.times(targetTokenPrice).gte(minSwapAmountPrice) || event.amount0Out.times(targetTokenPrice).gte(minSwapAmountPrice)
        : event.amount1In.times(targetTokenPrice).gte(minSwapAmountPrice) || event.amount1Out.times(targetTokenPrice).gte(minSwapAmountPrice)
    ) || (
      event.senderBalance.gte(balanceAlertAmount) || event.senderStaked.gte(balanceAlertAmount)
    )
  }
)

export const filterMinAmountSwapLogs = filter<SwapEvent>(
  (event) => {
    const targetTokenPrice = targetPriceFetcher.getPrice()

    return (
      event.pair.token0.address === targetToken.address
        ? event.amount0In.times(targetTokenPrice).gte(minSwapAmountPriceWithLargeBalance) || event.amount0Out.times(targetTokenPrice).gte(minSwapAmountPriceWithLargeBalance)
        : event.amount1In.times(targetTokenPrice).gte(minSwapAmountPriceWithLargeBalance) || event.amount1Out.times(targetTokenPrice).gte(minSwapAmountPriceWithLargeBalance)
    )
  }
)

export const filterLpEvents = filter<MintLpEvent|BurnLpEvent>(
  (event) => {
    const targetTokenPrice = targetPriceFetcher.getPrice()

    return event.pair.token0.address === targetToken.address
      ? event.amount0.times(targetTokenPrice).gte(minLpAmountPrice / 2)
      : event.amount1.times(targetTokenPrice).gte(minLpAmountPrice / 2)
  }
)

export const filterStakingEvents = filter<StakedEvent | UnstakedEvent | RewardedEvent>(
  (event) => {
    if (
      event.stakingPool.stakingToken.type === 'LP-TOKEN'
      && event.stakingPool.stakingToken.token0.address !== targetToken.address
      && event.stakingPool.stakingToken.token1.address !== targetToken.address
      && event.name !== 'Rewarded'
    ) {
      return false
    }

    const targetTokenPrice = targetPriceFetcher.getPrice()

    if (event.name === 'Rewarded') {
      return event.amount.times(targetTokenPrice).gte(rewardAmountPrice)
    }

    const stakingToken = event.stakingPool.stakingToken
    let stakingTokenPrice:BigNumber

    if (stakingToken.type === 'LP-TOKEN') {
      stakingTokenPrice = targetPriceFetcher.getLpPrice(stakingToken)
    } else if (stakingToken.address === targetToken.address) {
      stakingTokenPrice = targetTokenPrice
    } else {
      throw new Error('[filterStakingEvents]: unknow token type')
    }

    return event.amount.times(stakingTokenPrice).gte(stakeLpAmountPrice)
  }
)

export const filterApprovalEvents = filter<BaseTargetEventWithTransactionAndBalance<ApprovalTokenEvent>>(
  (event) => {
    const targetTokenPrice = targetPriceFetcher.getPrice()

    return (
      event.transaction
      && event.transaction.response?.to === event.token.address
      && (
        event.senderBalance.times(targetTokenPrice).gte(balanceAlertAmount)
        || event.senderStaked.times(targetTokenPrice).gte(balanceAlertAmount)
      )
    )
  }
)
