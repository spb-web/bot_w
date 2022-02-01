import type { MessagePayloadType } from '@/libs/TgBot'
import type { ApprovalTokenEvent } from '@/watchers/approval'
import type { BaseTargetEventWithTransactionAndBalance } from '@/entries'
import { toLocaleString } from '../utils/toLocaleString'
import { humanizateBalance, humanizateStakedBalance } from './humanizateBalance'
import { whalesChatId } from '../config/constants/telegram'
import { getButtons } from './getButtons'
import BigNumber from 'bignumber.js'

// Чуть меньше, т.к. не везде максимальный апрув
const MAX_AMOUNT = new BigNumber('0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

export const humanizateApprovalLog = (log:BaseTargetEventWithTransactionAndBalance<ApprovalTokenEvent>): MessagePayloadType => {
  const amountStr = MAX_AMOUNT.lte(log.rawAmount) ? 'максимального кол-ва' : toLocaleString(log.amount)
  const exchageName = `на #${log.exchageName}`
  const response = log.transaction.response
  const symbol = log.token.symbol
  const sender = response ? `С кошелька \`\`\`${response.from}\`\`\`` : 'Не удалось загрузить адрес'
  const targetTokenBalance = humanizateBalance(log.senderBalance)
  const targetTokenStaked = humanizateStakedBalance(log.senderStaked)

  let text = `🔑 #Аппрув ${amountStr} ${symbol} ${exchageName} \n${sender}\n${targetTokenBalance}\n${targetTokenStaked}`

  return {
    chatId: whalesChatId,
    text,
    extra: {
      reply_markup: getButtons(log),
    },
  }
}
