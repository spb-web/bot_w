import type { ProjectLimitsType, ProjectMinLimitsType } from "@/entries"

export const limits:ProjectLimitsType = {
  minTransferAmountPrice: 4000,
  minSwapAmountPrice: 4000,
  minSwapAmountPriceWithLargeBalance: 400,
  minLpAmountPrice: 4000,
  rewardAmountPrice: 1000,
  stakeLpAmountPrice: 4000,
  balanceAlertAmount: 10000,
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
