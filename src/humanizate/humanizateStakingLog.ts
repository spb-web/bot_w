import type { RewardedEvent, StakedEvent, UnstakedEvent } from '@/watchers/staking'
import type { MessagePayloadType } from '@/libs/TgBot'
import { targetToken } from '../config/tokens'
import BigNumber from 'bignumber.js'
import { targetPriceFetcher } from '../libs/TargetPriceFetcher'
import { toLocaleString } from '../utils/toLocaleString'
import { whalesChatId } from '../config/constants/telegram'
import { getButtons } from './getButtons'
import { isLpWithTargetToken } from '../utils/isLpWithTargetToken'

export const humanizateStakingLog = (log:StakedEvent|UnstakedEvent|RewardedEvent): MessagePayloadType => {
  const exchageName = `на \#${log.stakingPool.exchangeName}`
  const stakingToken = log.stakingPool.stakingToken
  const targetPrice = targetPriceFetcher.getPrice()
  let stakingTokenPrice:BigNumber
  let text:string

  if (log.name === 'Rewarded') {
    text = `🤝 #ВознаграждениеЗаСтейкинг ${ toLocaleString(log.amount) } ${log.stakingPool.earningToken.symbol} (~ $${toLocaleString(log.amount.times(targetPrice), true)}) из пула ${log.stakingPool.name} на адрес \`\`\`${log.to}\`\`\` ${exchageName}`
  } else {
    if (stakingToken.type === 'LP-TOKEN' && isLpWithTargetToken(stakingToken)) {
      stakingTokenPrice = targetPriceFetcher.getLpPrice(stakingToken)
    } else if (stakingToken.address === targetToken.address) {
      stakingTokenPrice = targetPrice
    } else {
      throw new Error(`[humanizateStakingLog]: unknow lp token ${JSON.stringify(stakingToken)}`);
    }
  
    if (log.name === 'Staked') {
      const amountPrice = log.amount.times(stakingTokenPrice)
      text = `👍 #Стейк ${ toLocaleString(log.amount) } ${stakingToken.symbol} (~ $${toLocaleString(amountPrice, true)}) в пул ${log.stakingPool.name} с адреса \`\`\`${log.owner}\`\`\` ${exchageName}`
    } else if (log.name === 'Unstaked') {
      const amountPrice = log.amount.times(stakingTokenPrice)
      text = `👎 #Анстейк ${ toLocaleString(log.amount) } ${stakingToken.symbol} (~ $${toLocaleString(amountPrice, true)}) из пула ${log.stakingPool.name} на адрес \`\`\`${log.to}\`\`\` ${exchageName}`
    } else {
      throw new Error(`[humanizateStakingLog]: unknow log ${JSON.stringify(log)}`);
    }
  }

  return {
    chatId: whalesChatId,
    text,
    extra: {
      reply_markup: getButtons(log),
    },
  }
}
