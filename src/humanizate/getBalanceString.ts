import type { ProjectType } from '@/entries'
import type { BigNumber } from 'bignumber.js'
import { toLocaleString } from '@/utils/toLocaleString'
import { TargetPriceFetcher } from '@/libs/TargetPriceFetcher'

export const getBalanceString = (project:ProjectType, priceFetcher: TargetPriceFetcher, balance:BigNumber):string => {
  let text = 'Баланс: Не удалось получить 🙁'
  const { limits: { balanceAlertAmount }, targetToken } = project

  const alertEmoji = balance.gte(balanceAlertAmount) ? '🚨 ' : ''

  if (balance.gt(0)) {
    text = `${alertEmoji}Баланс: ${toLocaleString(balance)} ${targetToken.symbol} (~ $${toLocaleString(balance.times(priceFetcher.getPrice()), true)})`
  } else if (balance.eq(0)) {
    text = 'Баланс: 0'
  }

  return text
}
