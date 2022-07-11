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
  minTransferAmount: 30000,
  minSwapAmount: 30000,
  minLpAmount: 30000,
  rewardAmount: 30000,
  stakeLpAmount: 30000,
}
