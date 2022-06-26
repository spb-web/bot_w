import type { RewardedEvent, StakedEvent, UnstakedEvent } from '@/watchers/stakingMultyContract'
import type { MessagePayloadType } from '@/libs/TgBot'
import { BigNumber } from 'bignumber.js'
import { targetPriceFetcher } from '../libs/TargetPriceFetcher'
import { toLocaleString } from '../utils/toLocaleString'
import { project, isTargetToken } from '../projects'
import { getButtons } from './getButtons'
import { isLpWithTargetToken } from '../utils/isLpWithTargetToken'
import { getWalletString } from './getWalletString'

export const humanizateStakingLog = (log:StakedEvent|UnstakedEvent|RewardedEvent): MessagePayloadType => {
  const { stakingPool, amount } = log.eventData
  const exchangeName = stakingPool.exchangeName
  const tags = [`#${project.name}`, `#${exchangeName}`]
  const stakingToken = stakingPool.stakingToken
  const targetPrice = targetPriceFetcher.getPrice()
  let stakingTokenPrice:BigNumber
  let text:string

  if (log.name === 'Rewarded') {
    text = `🤝 Вознаграждение за стейкинг ${ toLocaleString(amount) } ${stakingPool.earningToken.symbol} (~ $${toLocaleString(amount.times(targetPrice), true)}) из пула ${stakingPool.name} на адрес ${getWalletString(log.eventData.to)} на ${exchangeName}`
    tags.push('#ВознаграждениеЗаСтейкинг')
  } else {
    if (stakingToken.type === 'LP-TOKEN' && isLpWithTargetToken(stakingToken)) {
      stakingTokenPrice = targetPriceFetcher.getLpPrice(stakingToken)
    } else if (isTargetToken(stakingToken.address)) {
      stakingTokenPrice = targetPrice
    } else {
      throw new Error(`[humanizateStakingLog]: unknow lp token ${JSON.stringify(stakingToken)}`);
    }
  
    if (log.name === 'Staked') {
      const amountPrice = amount.times(stakingTokenPrice)
      text = `👍 Стейк ${ toLocaleString(amount) } ${stakingToken.symbol} (~ $${toLocaleString(amountPrice, true)}) в пул ${stakingPool.name} с адреса ${getWalletString(log.eventData.owner)} на ${exchangeName}`
      tags.push('#Стейк')
    } else if (log.name === 'Unstaked') {
      const amountPrice = amount.times(stakingTokenPrice)
      text = `👎 Анстейк ${ toLocaleString(amount) } ${stakingToken.symbol} (~ $${toLocaleString(amountPrice, true)}) из пула ${stakingPool.name} на адрес ${getWalletString(log.eventData.to)} на ${exchangeName}`
      tags.push('#Анстейк')
    } else {
      throw new Error(`[humanizateStakingLog]: unknow log ${JSON.stringify(log)}`);
    }
  }

  text += `\n\n${tags.join(' ')}`

  return {
    chatId: project.telegram.whalesChatId,
    text,
    extra: {
      reply_markup: getButtons(log),
    },
  }
}
