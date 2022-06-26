import { BigNumber } from 'bignumber.js'
import { targetToken, limits } from '@/projects'
import { toLocaleString } from '@/utils/toLocaleString'
import { targetPriceFetcher } from '@/libs/TargetPriceFetcher'

const { balanceAlertAmount } = limits

export const getBalanceString = (balance:BigNumber):string => {
  let text = 'Баланс: Не удалось получить 🙁'

  const alertEmoji = balance.gte(balanceAlertAmount) ? '🚨 ' : ''

  if (balance.gt(0)) {
    text = `${alertEmoji}Баланс: ${toLocaleString(balance)} ${targetToken.symbol} (~ $${toLocaleString(balance.times(targetPriceFetcher.getPrice()), true)})`
  } else if (balance.eq(0)) {
    text = 'Баланс: 0'
  }

  return text
}
