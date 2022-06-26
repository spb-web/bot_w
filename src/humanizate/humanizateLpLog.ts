import type { BurnLpEvent, MintLpEvent } from '@/watchers'
import type { MessagePayloadType } from '@/libs/TgBot'
import { targetPriceFetcher } from '../libs/TargetPriceFetcher'
import { project, targetToken } from '../projects'
import { toLocaleString } from '../utils/toLocaleString'
import { getButtons } from './getButtons'
import { getWalletString } from './getWalletString'

export const humanizateLpLog = (log:MintLpEvent|BurnLpEvent): MessagePayloadType => {
  const lpSymbol = log.pair.symbol
  const exchageName = `на #${log.pair.exchangeName}`
  const targetAmount = log.pair.token0.address === targetToken.address 
    ? log.amount0
    : log.amount1
  const lpAmountPrice = targetAmount.times(targetPriceFetcher.getPrice()).times(2)
  const lpAmountPriceStr= `(~ $${toLocaleString(lpAmountPrice, true)})`
  let text:string

  if (log.name === 'Burn') {
    text = `🔴 #УдаленаЛиквидность ${lpSymbol} ${lpAmountPriceStr} \n Получено ${ toLocaleString(log.amount0) } ${log.pair.token0.symbol} и ${ toLocaleString(log.amount1) } ${log.pair.token1.symbol} на адрес ${getWalletString(log.to)} ${exchageName}`
  } else if (log.name === 'Mint') {
    text = `🟢 #ДобавленаЛиквидность ${lpSymbol} ${lpAmountPriceStr} \n ${ toLocaleString(log.amount0) } ${log.pair.token0.symbol} и ${ toLocaleString(log.amount1) } ${log.pair.token1.symbol} ${exchageName}`
  } else {
    throw new Error(`[humanizateLpLog]: unknow log ${JSON.stringify(log)}`);
  }

  return {
    chatId: project.telegram.whalesChatId,
    text,
    extra: {
      reply_markup: getButtons(log),
    },
  }
}
