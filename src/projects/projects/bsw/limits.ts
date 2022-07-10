import type { ProjectLimitsType, ProjectMinLimitsType } from "@/entries"

export const limits:ProjectLimitsType = {
  minTransferAmountPrice: 5000,
  minSwapAmountPrice: 5000,
  minSwapAmountPriceWithLargeBalance: 5000,
  minLpAmountPrice: 5000,
  rewardAmountPrice: 5000,
  stakeLpAmountPrice: 5000,
  balanceAlertAmount: 5000,
}

export const publicLimits:ProjectLimitsType = {
  minTransferAmountPrice: 10000,
  minSwapAmountPrice: 10000,
  minSwapAmountPriceWithLargeBalance: 10000,
  minLpAmountPrice: 10000,
  rewardAmountPrice: 10000,
  stakeLpAmountPrice: 10000,
  balanceAlertAmount: 10000,
}

export const minLimits:ProjectMinLimitsType = {
  minTransferAmount: 1000,
  minSwapAmount: 1000,
  minLpAmount: 1000,
  rewardAmount: 1000,
  stakeLpAmount: 1000,
}