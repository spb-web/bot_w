import type { ProjectLimitsType, ProjectMinLimitsType } from "@/entries"

export const limits:ProjectLimitsType = {
  minTransferAmountPrice: 0,
  minSwapAmountPrice: 0,
  minSwapAmountPriceWithLargeBalance: 0,
  minLpAmountPrice: 0,
  rewardAmountPrice: 0,
  stakeLpAmountPrice: 0,
  balanceAlertAmount: 0,
}

export const publicLimits:ProjectLimitsType = {
  minTransferAmountPrice: 0,
  minSwapAmountPrice: 0,
  minSwapAmountPriceWithLargeBalance: 0,
  minLpAmountPrice: 0,
  rewardAmountPrice: 0,
  stakeLpAmountPrice: 0,
  balanceAlertAmount: 0,
}

export const minLimits:ProjectMinLimitsType = {
  minTransferAmount: 30000,
  minSwapAmount: 30000,
  minLpAmount: 30000,
  rewardAmount: 30000,
  stakeLpAmount: 30000,
}
