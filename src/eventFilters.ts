import type { SwapEvent, TransferEvent, BurnLpEvent, MintLpEvent, StakedEvent, UnstakedEvent, RewardedEvent } from './watchers'
import type { BaseTargetEventWithTransactionAndBalance } from '@/entries'
import { BigNumber } from 'bignumber.js'
import { filter } from 'rxjs'
import { pairs, stakingPools, routes, isTargetToken, limits } from './projects'
import { targetPriceFetcher } from './libs/TargetPriceFetcher'
import { ApprovalTokenEvent } from './watchers/approval'

const {balanceAlertAmount, minLpAmountPrice, minSwapAmountPrice, minSwapAmountPriceWithLargeBalance, minTransferAmountPrice, rewardAmountPrice, stakeLpAmountPrice} = limits

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
      isTargetToken(event.pair.token0.address)
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
      isTargetToken(event.pair.token0.address)
        ? event.amount0In.times(targetTokenPrice).gte(minSwapAmountPriceWithLargeBalance) || event.amount0Out.times(targetTokenPrice).gte(minSwapAmountPriceWithLargeBalance)
        : event.amount1In.times(targetTokenPrice).gte(minSwapAmountPriceWithLargeBalance) || event.amount1Out.times(targetTokenPrice).gte(minSwapAmountPriceWithLargeBalance)
    )
  }
)

export const filterLpEvents = filter<MintLpEvent|BurnLpEvent>(
  (event) => {
    const targetTokenPrice = targetPriceFetcher.getPrice()

    return isTargetToken(event.pair.token0.address)
      ? event.amount0.times(targetTokenPrice).gte(minLpAmountPrice / 2)
      : event.amount1.times(targetTokenPrice).gte(minLpAmountPrice / 2)
  }
)

export const filterStakingEvents = filter<StakedEvent | UnstakedEvent | RewardedEvent>(
  (event) => {
    const { stakingPool, amount } = event.eventData
    if (
      stakingPool.stakingToken.type === 'LP-TOKEN'
      && !isTargetToken(stakingPool.stakingToken.token0.address)
      && !isTargetToken(stakingPool.stakingToken.token1.address)
      && event.name !== 'Rewarded'
    ) {
      return false
    }

    const targetTokenPrice = targetPriceFetcher.getPrice()

    if (event.name === 'Rewarded') {
      return amount.times(targetTokenPrice).gte(rewardAmountPrice)
    }

    const stakingToken = stakingPool.stakingToken
    let stakingTokenPrice:BigNumber

    if (stakingToken.type === 'LP-TOKEN') {
      stakingTokenPrice = targetPriceFetcher.getLpPrice(stakingToken)
    } else if (isTargetToken(stakingToken.address)) {
      stakingTokenPrice = targetTokenPrice
    } else {
      throw new Error('[filterStakingEvents]: unknow token type')
    }

    return amount.times(stakingTokenPrice).gte(stakeLpAmountPrice)
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
