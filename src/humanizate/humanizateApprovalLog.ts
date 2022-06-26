import type { MessagePayloadType } from '@/libs/TgBot'
import type { ApprovalTokenEvent } from '@/watchers/approval'
import type { BaseTargetEventWithTransactionAndBalance } from '@/entries'
import { toLocaleString } from '../utils/toLocaleString'
import { getBalanceString } from './getBalanceString'
import { getStakedBalance } from './getStakedBalance'
import { project } from '../projects'
import { getButtons } from './getButtons'
import { BigNumber } from 'bignumber.js'

// Чуть меньше, т.к. не везде максимальный апрув
const MAX_AMOUNT = new BigNumber('0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

export const humanizateApprovalLog = (log:BaseTargetEventWithTransactionAndBalance<ApprovalTokenEvent>): MessagePayloadType => {
  const amountStr = MAX_AMOUNT.lte(log.rawAmount) ? 'максимального кол-ва' : toLocaleString(log.amount)
  const exchageName = `на #${log.exchageName}`
  const response = log.transaction.response
  const symbol = log.token.symbol
  const sender = response ? `С кошелька \`\`\`${response.from}\`\`\`` : 'Не удалось загрузить адрес'
  const targetTokenBalance = getBalanceString(log.senderBalance)
  const targetTokenStaked = getStakedBalance(log.senderStaked)

  let text = `🔑 #Аппрув ${amountStr} ${symbol} ${exchageName} \n${sender}\n${targetTokenBalance}\n${targetTokenStaked}`

  return {
    chatId: project.telegram.whalesChatId,
    text,
    extra: {
      reply_markup: getButtons(log),
    },
  }
}
