import type { SwapEvent } from '@/watchers'
import type { MessagePayloadType } from '@/libs/TgBot'
import type { BaseTargetEventWithTransactionAndBalance } from '@/entries'
import { targetToken } from '../config/tokens'
import { toLocaleString } from '../utils/toLocaleString'
import { humanizateBalance, humanizateStakedBalance } from './humanizateBalance'
import { whalesChatId } from '../config/constants/telegram'
import { getButtons } from './getButtons'

const sell = '🐻 #Продажа'
const buy = '🐮 #Покупка'

export const humanizateSwapLog = (log:BaseTargetEventWithTransactionAndBalance<SwapEvent>): MessagePayloadType => {
  const exchageName = `на #${log.pair.exchangeName}`
  const response = log.transaction.response
  const symbol0 = log.pair.token0.symbol
  const symbol1 = log.pair.token1.symbol
  const sender = response ? `С кошелька \`\`\`${response.from}\`\`\`` : 'Не удалось загрузить адрес'
  const targetTokenBalance = humanizateBalance(log.senderBalance)
  const targetTokenStaked = humanizateStakedBalance(log.senderStaked)

  let text = ''
  let price = ''

  if (log.pair.token0.address === targetToken.address) {
    if (log.amount0In.gt(0)) {
      text = `${sell} ${toLocaleString(log.amount0In)} ${symbol0} за ${toLocaleString(log.amount1Out)} ${symbol1} ${exchageName}`
      price = `1 ${symbol0} \\\= ${toLocaleString(log.amount1Out.div(log.amount0In))} ${symbol1}`
    } else {
      text = `${buy} ${toLocaleString(log.amount0Out)} ${symbol0} за ${toLocaleString(log.amount1In)} ${symbol1} ${exchageName}`
      price = `1 ${symbol0} \\\= ${toLocaleString(log.amount1In.div(log.amount0Out))} ${symbol1}`
    } 
  } else if (log.amount1In.gt(0)) {
    text = `${sell} ${toLocaleString(log.amount1In)} ${symbol1} за ${toLocaleString(log.amount0Out)} ${symbol0} ${exchageName}`
    price = `1 ${symbol1} \\\= ${toLocaleString(log.amount0Out.div(log.amount1In))} ${symbol0}`
  } else {
    text = `${buy} ${toLocaleString(log.amount1Out)} ${symbol1} за ${toLocaleString(log.amount0In)} ${symbol0} ${exchageName}`
    price = `1 ${symbol1} \\\= ${toLocaleString(log.amount0In.div(log.amount1Out))} ${symbol0}`
  }

  text = `${text}\n${price}\n${sender}\n${targetTokenBalance}\n${targetTokenStaked}`

  return {
    chatId: whalesChatId,
    text,
    extra: {
      reply_markup: getButtons(log),
    },
  }
}
