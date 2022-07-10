import type { BurnLpEvent, MintLpEvent } from '@/watchers'
import type { MessagePayloadType } from '@/libs/TgBot'
import type { BaseTargetEventWithTransaction, ProjectType } from '@/entries'
import type { TargetPriceFetcher } from '@/libs/TargetPriceFetcher'
import { toLocaleString } from '@/utils/toLocaleString'
import { getButtons } from './getButtons'
import { getWalletString } from './getWalletString'
import { isEqualTokens } from '@/utils/isEqualTokens'

export const humanizateLpLog = (project: ProjectType, priceFetcher: TargetPriceFetcher, log:BaseTargetEventWithTransaction<MintLpEvent|BurnLpEvent>): MessagePayloadType => {
  const { eventData, name: logName, addressesInfo } = log
  const { pair: { symbol: lpSymbol, exchangeName } } = eventData
  const tags:string[] = [`#${project.name}Whales`, `#${exchangeName}`]
  const targetAmount = isEqualTokens(eventData.pair.token0, project.targetToken)
    ? eventData.amount0
    : eventData.amount1
  const lpAmountPrice = targetAmount.times(priceFetcher.getPrice()).times(2)
  const lpAmountPriceStr= `(~ $${toLocaleString(lpAmountPrice, true)})`
  let text:string

  if (logName === 'Burn-LP') {
    const to = getWalletString(eventData.to, addressesInfo)
    text = `🔴 Удалена ликвидность ${lpSymbol} ${lpAmountPriceStr} \n Получено ${ toLocaleString(eventData.amount0) } ${eventData.pair.token0.symbol} и ${ toLocaleString(eventData.amount1) } ${eventData.pair.token1.symbol} на адрес ${to} на ${exchangeName}`
    tags.push(`#УдаленаЛиквидность`)
  } else if (logName === 'Mint-LP') {
    text = `🟢 Добавлена ликвидность ${lpSymbol} ${lpAmountPriceStr} \n ${ toLocaleString(eventData.amount0) } ${eventData.pair.token0.symbol} и ${ toLocaleString(eventData.amount1) } ${eventData.pair.token1.symbol} на ${exchangeName}`
    tags.push(`#ДобавленаЛиквидность`)
  } else {
    throw new Error(`[humanizateLpLog]: unknow log ${JSON.stringify(log)}`);
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
