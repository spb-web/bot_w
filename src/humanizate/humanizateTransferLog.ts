import type { TransferEvent } from '@/watchers'
import type { MessagePayloadType } from '@/libs/TgBot'
import { AddressZero } from '@ethersproject/constants'
import { project } from '../projects'
import { targetPriceFetcher } from '../libs/TargetPriceFetcher'
import { toLocaleString } from '../utils/toLocaleString'
import { getButtons } from './getButtons'
import { getWalletString } from './getWalletString'
import { BaseTargetEventWithTransaction } from '@/entries'

export const humanizateTransferLog = (log:BaseTargetEventWithTransaction<TransferEvent>):MessagePayloadType => {
  const price = targetPriceFetcher.getPrice()
  const amountCost = log.amount.times(price)
  const symbol = log.token.symbol
  let text:string

  const from = getWalletString(log.from, log.addressesInfo)
  const to = getWalletString(log.to, log.addressesInfo)
  const tags = [`#${project.name}`]

  if (log.from === AddressZero) {
    text = `🪄 Отчеканено ${toLocaleString(log.amount)} ${symbol} (~ $${toLocaleString(amountCost, true)}) на адрес ${to}`
    tags.push('#Отчеканено')
  } else {
    text = `📩 Отправлено ${toLocaleString(log.amount)} ${symbol} (~ $${toLocaleString(amountCost, true)}) \n\nиз ${from} \nв ${to}`
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
