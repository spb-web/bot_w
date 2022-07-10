import type { TransferEvent } from '@/watchers'
import type { MessagePayloadType } from '@/libs/TgBot'
import type { BaseTargetEventWithTransaction, ProjectType } from '@/entries'
import type { TargetPriceFetcher } from '@/libs/TargetPriceFetcher'
import { AddressZero } from '@ethersproject/constants'
import { toLocaleString } from '../utils/toLocaleString'
import { getButtons } from './getButtons'
import { getWalletString } from './getWalletString'

export const humanizateTransferLog = (project: ProjectType, priceFetcher: TargetPriceFetcher, log:BaseTargetEventWithTransaction<TransferEvent>):MessagePayloadType => {
  const price = priceFetcher.getPrice()
  const amountCost = log.eventData.amount.times(price)
  const symbol = log.eventData.token.symbol
  let text:string

  const from = getWalletString(log.eventData.from, log.addressesInfo)
  const to = getWalletString(log.eventData.to, log.addressesInfo)
  const tags = [`#${project.name}Whales`]

  if (log.eventData.from === AddressZero) {
    text = `🪄 Отчеканено ${toLocaleString(log.eventData.amount)} ${symbol} (~ $${toLocaleString(amountCost, true)}) на адрес ${to}`
    tags.push('#Отчеканено')
  } else {
    text = `📩 Отправлено ${toLocaleString(log.eventData.amount)} ${symbol} (~ $${toLocaleString(amountCost, true)}) \n\nиз ${from} \nв ${to}`
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
