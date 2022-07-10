import { BaseTargetEventWithTransactionAndBalance, ProjectEventType } from '@/entries'
import { humanizateApprovalLog, humanizateLpLog, humanizateStakingLog, humanizateSwapLog, humanizateTransferLog } from '@/humanizate'
import { MessagePayloadType } from '@/libs/TgBot'
import { AllEvents } from '@/watchers'
import { switchMap, of, Observable } from 'rxjs'

type Input = ProjectEventType<BaseTargetEventWithTransactionAndBalance<AllEvents>>

type Output = Input & {
  tgMessage: MessagePayloadType
}

export const telegramMessagePipe = switchMap<Input, Observable<Output>>((payload) => {
  const {event} = payload

  switch (event.name) {
    case 'Approval': {
      return of({ ...payload, tgMessage: humanizateApprovalLog(payload.project, payload.priceFetcher, event) })
    }

    case 'Mint-LP':
    case 'Burn-LP': {
      return of({ ...payload, tgMessage: humanizateLpLog(payload.project, payload.priceFetcher, event) })
    }

    case 'Rewarded':
    case 'Staked':
    case 'Unstaked': {
      return of({ ...payload, tgMessage: humanizateStakingLog(payload.project, payload.priceFetcher, event) })
    }

    case 'Swap': {
      return of({ ...payload, tgMessage: humanizateSwapLog(payload.project, payload.priceFetcher, event) })
    }

    case 'Transfer': {
      return of({ ...payload, tgMessage: humanizateTransferLog(payload.project, payload.priceFetcher, event) })
    }
  
    default:
      throw new Error('[telegramMessagePipe]: unknow event name')
  }
})