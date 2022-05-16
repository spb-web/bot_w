import type { TransferEvent } from '@/watchers'
import type { MessagePayloadType } from '@/libs/TgBot'
import { targetPriceFetcher } from '../libs/TargetPriceFetcher'
import { toLocaleString } from '../utils/toLocaleString'
import { whalesChatId } from '../config/constants/telegram'
import { getButtons } from './getButtons'

const NOMINEX_HOT_WALLET = '0x90aFDA51611523bE69abD37e26C2bf9162ACb797'
const NOMINEX_MONEY_BOX_WALLET = '0xcD58a3928a162C6ec8A7Fe4c9537a322c023af6E'

export const humanizateTransferLog = (log:TransferEvent):MessagePayloadType => {
  const price = targetPriceFetcher.getPrice()
  const amountCost = log.amount.times(price)
  const symbol = log.token.symbol
  let text:string

  if (log.from === NOMINEX_HOT_WALLET) {
    text = `📩 #Отправлено ${toLocaleString(log.amount)} ${symbol} (~ $${toLocaleString(amountCost, true)}) из NOMINEX HOT WALLET в \`\`\`${log.to}\`\`\``
  } else if (log.from === NOMINEX_MONEY_BOX_WALLET) {
    text = `📩 #Отправлено ${toLocaleString(log.amount)} ${symbol} (~ $${toLocaleString(amountCost, true)}) из NOMINEX MONEY BOX WALLET в \`\`\`${log.to}\`\`\``
  } else if (log.from === '0x0000000000000000000000000000000000000000') {
    text = `🪄 #Отчеканено ${toLocaleString(log.amount)} ${symbol} (~ $${toLocaleString(amountCost, true)})`
  } else {
    text = `📩 #Отправлено ${toLocaleString(log.amount)} ${symbol} (~ $${toLocaleString(amountCost, true)}) из \`\`\`${log.from}\`\`\` в \`\`\`${log.to}\`\`\``
  }

  return {
    chatId: whalesChatId,
    text,
    extra: {
      reply_markup: getButtons(log),
    },
  }
}
