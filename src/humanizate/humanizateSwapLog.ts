import type { SwapEvent } from '@/watchers'
import type { MessagePayloadType } from '@/libs/TgBot'
import type { BaseTargetEventWithTransactionAndBalance } from '@/entries'
import { toLocaleString } from '../utils/toLocaleString'
import { getBalanceString } from './getBalanceString'
import { getStakedBalance } from './getStakedBalance'
import { project, isTargetToken } from '../projects'
import { getButtons } from './getButtons'
import { getWalletString } from './getWalletString'

const sell = '🐻 Продажа'
const buy = '🐮 Покупка'

export const humanizateSwapLog = (log:BaseTargetEventWithTransactionAndBalance<SwapEvent>): MessagePayloadType => {
  const exchangeName = log.pair.exchangeName
  const response = log.transaction.response
  const symbol0 = log.pair.token0.symbol
  const symbol1 = log.pair.token1.symbol
  const sender = response ? `С кошелька ${getWalletString(response.from)}` : 'Не удалось загрузить адрес'
  const targetTokenBalance = getBalanceString(log.senderBalance)
  const targetTokenStaked = getStakedBalance(log.senderStaked)
  const tags = [`#${project.name}`, `#${exchangeName}`]

  let text = ''
  let price = ''

  if (isTargetToken(log.pair.token0.address)) {
    if (log.amount0In.gt(0)) {
      text = `${sell} ${toLocaleString(log.amount0In)} ${symbol0} за ${toLocaleString(log.amount1Out)} ${symbol1} на ${exchangeName}`
      price = `1 ${symbol0} \\\= ${toLocaleString(log.amount1Out.div(log.amount0In))} ${symbol1}`
      tags.push('#Продажа')
    } else {
      text = `${buy} ${toLocaleString(log.amount0Out)} ${symbol0} за ${toLocaleString(log.amount1In)} ${symbol1} на ${exchangeName}`
      price = `1 ${symbol0} \\\= ${toLocaleString(log.amount1In.div(log.amount0Out))} ${symbol1}`
      tags.push('#Покупка')
    } 
  } else if (log.amount1In.gt(0)) {
    text = `${sell} ${toLocaleString(log.amount1In)} ${symbol1} за ${toLocaleString(log.amount0Out)} ${symbol0} на ${exchangeName}`
    price = `1 ${symbol1} \\\= ${toLocaleString(log.amount0Out.div(log.amount1In))} ${symbol0}`
    tags.push('#Продажа')
  } else {
    text = `${buy} ${toLocaleString(log.amount1Out)} ${symbol1} за ${toLocaleString(log.amount0In)} ${symbol0} на ${exchangeName}`
    price = `1 ${symbol1} \\\= ${toLocaleString(log.amount0In.div(log.amount1Out))} ${symbol0}`
    tags.push('#Покупка')
  }

  text = `${text}\n${price}\n${sender}\n${targetTokenBalance}\n${targetTokenStaked}`
  text += `\n\n${tags.join(' ')}`

  return {
    chatId: project.telegram.whalesChatId,
    text,
    extra: {
      reply_markup: getButtons(log),
    },
  }
}
