import type { ProjectLimitsType, ProjectMinLimitsType } from "@/entries"

export const limits:ProjectLimitsType = {
  minTransferAmountPrice: 2000,
  minSwapAmountPrice: 2000,
  minSwapAmountPriceWithLargeBalance: 400,
  minLpAmountPrice: 2000,
  rewardAmountPrice: 500,
  stakeLpAmountPrice: 2000,
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
  minTransferAmount: 300,
  minSwapAmount: 300,
  minLpAmount: 300,
  rewardAmount: 300,
  stakeLpAmount: 300,
}
