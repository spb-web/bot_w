import { BaseTargetEventWithTransactionAndBalance, ProjectEventType } from '@/entries'
import { MessagePayloadType } from '@/libs/TgBot'
import { AllEvents } from '@/watchers'
import { switchMap, Observable, from } from 'rxjs'

type Input = ProjectEventType<BaseTargetEventWithTransactionAndBalance<AllEvents>> & {
  tgMessage: MessagePayloadType
}

type Output = Input & {
  tgMessageChatId: string
}

export const telegramMessageTargetPipe = switchMap<Input, Observable<Output>>((payload) => {
  const {event, project: { publicLimits, telegram: { publicWhalesChatId, whalesChatId } }, priceFetcher } = payload

  const events = [{ ...payload, tgMessageChatId: whalesChatId }]
  const targetPrice = priceFetcher.getPrice()

  switch (event.name) {
    case 'Approval': {
      if (event.senderBalance.times(targetPrice).gte(publicLimits.balanceAlertAmount)) {
        events.push({ ...payload, tgMessageChatId: publicWhalesChatId })
      }

      break
    }

    case 'Mint-LP':
    case 'Burn-LP': {
      if (event.eventData.targetAmount.times(targetPrice).gte(publicLimits.minLpAmountPrice / 2)) {
        events.push({ ...payload, tgMessageChatId: publicWhalesChatId })
      }

      break
    }

    case 'Rewarded':
    case 'Staked':
    case 'Unstaked': {
      if (event.eventData.amount.times(targetPrice).gte(publicLimits.rewardAmountPrice)) {
        events.push({ ...payload, tgMessageChatId: publicWhalesChatId })
      }

      break
    }

    case 'Swap': {
      if (event.eventData.targetAmount.times(targetPrice).gte(publicLimits.minSwapAmountPrice)) {
        events.push({ ...payload, tgMessageChatId: publicWhalesChatId })
      }

      break
    }

    case 'Transfer': {
      if (event.eventData.amount.times(targetPrice).gte(publicLimits.minTransferAmountPrice)) {
        events.push({ ...payload, tgMessageChatId: publicWhalesChatId })
      }

      break
    }
  
    default: {
      throw new Error('[telegramMessagePipe]: unknow event name')
    }
  }

  return from(events)
})
