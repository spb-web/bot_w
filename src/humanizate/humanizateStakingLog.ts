import type { RewardedEvent, StakedEvent, UnstakedEvent } from '@/watchers/stakingMultyContract'
import type { MessagePayloadType } from '@/libs/TgBot'
import type { BaseTargetEventWithTransaction, ProjectType } from '@/entries'
import { BigNumber } from 'bignumber.js'
import { toLocaleString } from '../utils/toLocaleString'
import { getButtons } from './getButtons'
import { isLpWithTargetToken } from '../utils/isLpWithTargetToken'
import { getWalletString } from './getWalletString'
import { isEqualTokens } from '@/utils/isEqualTokens'
import { TargetPriceFetcher } from '@/libs/TargetPriceFetcher'

export const humanizateStakingLog = (project: ProjectType, priceFetcher:TargetPriceFetcher, log:BaseTargetEventWithTransaction<StakedEvent|UnstakedEvent|RewardedEvent>): MessagePayloadType => {
  const { stakingPool, amount } = log.eventData
  const exchangeName = stakingPool.exchangeName
  const tags = [`#${project.name}Whales`, `#${exchangeName}`]
  const stakingToken = stakingPool.stakingToken
  const targetPrice = priceFetcher.getPrice()
  let stakingTokenPrice:BigNumber|null = null
  let text:string

  if (log.name === 'Rewarded') {
    const to = getWalletString(log.eventData.to, log.addressesInfo)
    text = `🤝 Вознаграждение за стейкинг ${ toLocaleString(amount) } ${stakingPool.earningToken.symbol} (~ $${toLocaleString(amount.times(targetPrice), true)}) из пула ${stakingPool.name} на адрес ${to} на ${exchangeName}`
    tags.push('#ВознаграждениеЗаСтейкинг')
  } else {
    if (stakingToken.type === 'LP-TOKEN' && isLpWithTargetToken(stakingToken, project.targetToken)) {
      stakingTokenPrice = priceFetcher.getLpPrice(stakingToken)
    } else if (isEqualTokens(stakingToken, project.targetToken)) {
      stakingTokenPrice = targetPrice
    } else {
      //throw new Error(`[humanizateStakingLog]: unknow lp token ${JSON.stringify(stakingToken)}`);
    }
  
    if (log.name === 'Staked') {
      const amountPrice = stakingTokenPrice ? `(~ $${toLocaleString(amount.times(stakingTokenPrice), true)})` : ''
      const owner = getWalletString(log.eventData.owner, log.addressesInfo)
      text = `👍 Стейк ${ toLocaleString(amount) } ${stakingToken.symbol} ${amountPrice} в пул ${stakingPool.name} с адреса ${owner} на ${exchangeName}`
      tags.push('#Стейк')
    } else if (log.name === 'Unstaked') {
      const amountPrice = stakingTokenPrice ? `(~ $${toLocaleString(amount.times(stakingTokenPrice), true)})` : ''
      const to = getWalletString(log.eventData.to, log.addressesInfo)
      text = `👎 Анстейк ${ toLocaleString(amount) } ${stakingToken.symbol} ${amountPrice} из пула ${stakingPool.name} на адрес ${to} на ${exchangeName}`
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
