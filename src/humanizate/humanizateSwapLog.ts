import { SwapEvent, SwapSide } from '@/watchers'
import type { MessagePayloadType } from '@/libs/TgBot'
import type { BaseTargetEventWithTransactionAndBalance, ProjectType } from '@/entries'
import type { TargetPriceFetcher } from '@/libs/TargetPriceFetcher'
import { toLocaleString } from '../utils/toLocaleString'
import { getBalanceString } from './getBalanceString'
import { getStakedBalance } from './getStakedBalance'
import { getButtons } from './getButtons'
import { getWalletString } from './getWalletString'

export const humanizateSwapLog = (project: ProjectType, priceFetcher: TargetPriceFetcher, event:BaseTargetEventWithTransactionAndBalance<SwapEvent>): MessagePayloadType => {
  const { eventData: { side, targetAmount, pairedAmount, targetToken, pairedToken } } = event
  const exchangeName = event.eventData.pair.exchangeName
  const response = event.transaction.response
  const sender = response ? `С кошелька ${getWalletString(response.from, event.addressesInfo)}` : 'Не удалось загрузить адрес'
  const targetTokenBalance = getBalanceString(project, priceFetcher, event.senderBalance)
  const targetTokenStaked = getStakedBalance(project, priceFetcher, event.senderStaked)
  const tags = [`#${project.name}Whales`, `#${exchangeName}`]
  const price = `1 ${targetToken.symbol} \\\= ${toLocaleString(pairedAmount.div(targetAmount))} ${pairedToken.symbol}`

  let text = ''

  if (side === SwapSide.BUY) {
    text = `🐮 Покупка ${toLocaleString(targetAmount)} ${targetToken.symbol} за ${toLocaleString(pairedAmount)} ${pairedToken.symbol} на ${exchangeName}`
    tags.push('#Покупка')
  } else {
    text = `🐻 Продажа ${toLocaleString(targetAmount)} ${targetToken.symbol} за ${toLocaleString(pairedAmount)} ${pairedToken.symbol} на ${exchangeName}`
    tags.push('#Продажа')
  }

  text = `${text}\n${price}\n${sender}\n${targetTokenBalance}\n${targetTokenStaked}`
  text += `\n\n${tags.join(' ')}`

  return {
    chatId: project.telegram.whalesChatId,
    text,
    extra: {
      reply_markup: getButtons(event),
    },
  }
}
