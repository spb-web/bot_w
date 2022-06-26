import { BigNumber } from 'bignumber.js'
import { targetToken, limits } from '@/projects'
import { toLocaleString } from '@/utils/toLocaleString'
import { targetPriceFetcher } from '@/libs/TargetPriceFetcher'

const { balanceAlertAmount } = limits

export const getStakedBalance = (staked:BigNumber):string => {
  let text = 'В стейкинге: Не удалось получить 🙁'
  const alertEmoji = staked.gte(balanceAlertAmount) ? '🚨 ' : ''

  if (staked.gt(0)) {
    text = `${alertEmoji}В стейкинге: ${toLocaleString(staked)} ${targetToken.symbol} (~ $${toLocaleString(staked.times(targetPriceFetcher.getPrice()), true)})`
  } else if (staked.eq(0)) {
    text = 'В стейкинге: 0'
  }

  return text
}
