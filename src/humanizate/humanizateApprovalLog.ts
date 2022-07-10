import type { MessagePayloadType } from '@/libs/TgBot'
import type { ApprovalTokenEvent } from '@/watchers/approval'
import type { BaseTargetEventWithTransactionAndBalance, ProjectType } from '@/entries'
import type { TargetPriceFetcher } from '@/libs/TargetPriceFetcher'
import { toLocaleString } from '../utils/toLocaleString'
import { getBalanceString } from './getBalanceString'
import { getStakedBalance } from './getStakedBalance'
import { getButtons } from './getButtons'
import { BigNumber } from 'bignumber.js'

// Чуть меньше, т.к. не везде максимальный апрув
const MAX_AMOUNT = new BigNumber('0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')

export const humanizateApprovalLog = (project: ProjectType, priceFetcher: TargetPriceFetcher, log: BaseTargetEventWithTransactionAndBalance<ApprovalTokenEvent>): MessagePayloadType => {
  const exchageName = log.exchageName
  const tags = [`#${project.name}Whales`, `#${exchageName}`, '#Аппрув']
  const amountStr = MAX_AMOUNT.lte(log.rawAmount) ? 'максимального кол-ва' : toLocaleString(log.amount)
  const response = log.transaction.response
  const symbol = log.token.symbol
  const sender = response ? `С кошелька \`\`\`${response.from}\`\`\`` : 'Не удалось загрузить адрес'
  const targetTokenBalance = getBalanceString(project, priceFetcher, log.senderBalance)
  const targetTokenStaked = getStakedBalance(project, priceFetcher, log.senderStaked)

  let text = `🔑 Аппрув ${amountStr} ${symbol} на ${exchageName} \n${sender}\n${targetTokenBalance}\n${targetTokenStaked}`
  text += `\n\n${tags.join(' ')}`

  return {
    chatId: project.telegram.whalesChatId,
    text,
    extra: {
      reply_markup: getButtons(log),
    },
  }
}
