import type { BaseTargetEventWithTransactionAndBalance } from './entries'
import type { WebSocketProvider } from '@ethersproject/providers'
import { map, mergeMap, Subject, takeUntil } from 'rxjs'
import { filterApprovalEvents, filterLpEvents, filterMinAmountSwapLogs, filterStakingEvents, filterSwapLogs, transfersFilter } from './eventFilters'
import { humanizateApprovalLog, humanizateLpLog, humanizateStakingLog, humanizateSwapLog, humanizateTransferLog } from './humanizate'
import { watchLpLogs, watchStakingLogs, watchSwapLog, watchTransfers, SwapEvent } from './watchers'
import { targetToken } from './config/tokens'
import { pairs } from './config/pairs'
import { targetPriceFetcher } from './libs/TargetPriceFetcher'
import { stakingPools } from './config/stakingPools'
import { lastBlockNumber } from './libs/LastBlockNumber'
import { watchBlock } from './watchers/block'
import { MessagePayloadType, tgBot } from './libs/TgBot'
import { watchApprovalLogs } from './watchers/approval'
import { addTransaction } from './transforms'
import { isLpWithTargetToken } from './utils/isLpWithTargetToken'

const pairsWithTargetToken = pairs.filter(isLpWithTargetToken)
const destroy$ = new Subject<void>()

export const watch = (wsProvider:WebSocketProvider) => {
  destroy$.next()

  const messagesSubject$ = new Subject<MessagePayloadType>()

  // Handel transfers
  watchTransfers(wsProvider, targetToken)
    .pipe(
      transfersFilter,
      map(humanizateTransferLog),
      takeUntil(destroy$)
    )
    .subscribe(messagesSubject$)

  // Handle swap
  const swapSubject$ = new Subject<BaseTargetEventWithTransactionAndBalance<SwapEvent>>()

  pairsWithTargetToken.forEach((pair) => {
    watchSwapLog(wsProvider, pair)
      .pipe(
        filterMinAmountSwapLogs,
        mergeMap(addTransaction),
        takeUntil(destroy$)
      )
      .subscribe(swapSubject$)
  })

  swapSubject$
    .pipe(
      filterSwapLogs,
      map(humanizateSwapLog),
      takeUntil(destroy$),
    )
    .subscribe(messagesSubject$)

  // Handle update prices
  swapSubject$
    .pipe(takeUntil(destroy$))
    .subscribe(targetPriceFetcher.handleSwapLog)

  // Handle LP
  pairsWithTargetToken.forEach((pair) => {
    watchLpLogs(wsProvider, pair)
      .pipe(
        filterLpEvents,
        map(humanizateLpLog),
        takeUntil(destroy$)
      )
      .subscribe(messagesSubject$)
  })

  // Handle staking
  stakingPools.forEach((stakingPool) => {
    watchStakingLogs(wsProvider, stakingPool)
      .pipe(
        filterStakingEvents,
        map(humanizateStakingLog),
        takeUntil(destroy$)
      )
      .subscribe(messagesSubject$)
  })

  // Approve
  watchApprovalLogs(wsProvider, targetToken)
    .pipe(
      mergeMap(addTransaction),
      filterApprovalEvents,
      map(humanizateApprovalLog),
      takeUntil(destroy$)
    )
    .subscribe(messagesSubject$)

  // Blocks number
  watchBlock(wsProvider)
    .pipe(takeUntil(destroy$))
    .subscribe(async (block) => {
      await lastBlockNumber.processBlockNumber(block.number)
    })

  // Telegram messages
  messagesSubject$
    .pipe(takeUntil(destroy$))
    .subscribe(
      (messagePayload) => tgBot.send(messagePayload),
      (error) => {
        console.error(error)

        tgBot.sendLog(`messagesSubject error ${JSON.stringify(error?.message)}`)
      },
      () => {
        tgBot.sendLog(`messagesSubject completed`)
      }
    )
}
