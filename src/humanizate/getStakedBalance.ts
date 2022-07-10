import type { BigNumber } from 'bignumber.js'
import type { ProjectType } from '@/entries'
import type { TargetPriceFetcher } from '@/libs/TargetPriceFetcher'
import { toLocaleString } from '@/utils/toLocaleString'

export const getStakedBalance = (project:ProjectType, priceFetcher: TargetPriceFetcher, staked:BigNumber):string => {
  let text = 'В стейкинге: Не удалось получить 🙁'
  const { limits: { balanceAlertAmount }, targetToken } = project
  const alertEmoji = staked.gte(balanceAlertAmount) ? '🚨 ' : ''

  if (staked.gt(0)) {
    text = `${alertEmoji}В стейкинге: ${toLocaleString(staked)} ${targetToken.symbol} (~ $${toLocaleString(staked.times(priceFetcher.getPrice()), true)})`
  } else if (staked.eq(0)) {
    text = 'В стейкинге: 0'
  }

  return text
}
