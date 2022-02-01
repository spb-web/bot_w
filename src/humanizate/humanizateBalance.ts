import BigNumber from 'bignumber.js'
import { targetToken } from '../config/tokens'
import { toLocaleString } from '../utils/toLocaleString'
import { targetPriceFetcher } from '../libs/TargetPriceFetcher'
import { balanceAlertAmount } from '../config/constants/limits'

export const humanizateBalance = (balance:BigNumber):string => {
  let text = 'Баланс: Не удалось получить 🙁'

  const alertEmoji = balance.gte(balanceAlertAmount) ? '🚨 ' : ''

  if (balance.gt(0)) {
    text = `${alertEmoji}Баланс: ${toLocaleString(balance)} ${targetToken.symbol} (~ $${toLocaleString(balance.times(targetPriceFetcher.getPrice()), true)})`
  } else if (balance.eq(0)) {
    text = 'Баланс: 0'
  }

  return text
}

export const humanizateStakedBalance = (staked:BigNumber):string => {
  let text = 'В стейкинге: Не удалось получить 🙁'
  const alertEmoji = staked.gte(balanceAlertAmount) ? '🚨 ' : ''

  if (staked.gt(0)) {
    text = `${alertEmoji}В стейкинге: ${toLocaleString(staked)} ${targetToken.symbol} (~ $${toLocaleString(staked.times(targetPriceFetcher.getPrice()), true)})`
  } else if (staked.eq(0)) {
    text = 'В стейкинге: 0'
  }

  return text
}
