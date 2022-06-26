import type { TransferEvent } from '@/watchers'
import type { MessagePayloadType } from '@/libs/TgBot'
import { AddressZero } from '@ethersproject/constants'
import { project } from '../projects'
import { targetPriceFetcher } from '../libs/TargetPriceFetcher'
import { toLocaleString } from '../utils/toLocaleString'
import { getButtons } from './getButtons'
import { getWalletString } from './getWalletString'

export const humanizateTransferLog = (log:TransferEvent):MessagePayloadType => {
  const price = targetPriceFetcher.getPrice()
  const amountCost = log.amount.times(price)
  const symbol = log.token.symbol
  let text:string

  const from = `из ${getWalletString(log.from)}`
  const to = `в ${getWalletString(log.to)}`
  const tags = [`#${project.name}`]

  if (log.from === AddressZero) {
    text = `🪄 Отчеканено ${toLocaleString(log.amount)} ${symbol} (~ $${toLocaleString(amountCost, true)}) на адрес ${to}`
    tags.push('#Отчеканено')
  } else {
    text = `📩 Отправлено ${toLocaleString(log.amount)} ${symbol} (~ $${toLocaleString(amountCost, true)}) \n${from} \n${to}`
    tags.push('#Отправлено')
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
