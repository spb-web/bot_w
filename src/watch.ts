import type { BaseTargetEventWithTransactionAndBalance } from '@/entries'
import type { BaseProvider } from '@ethersproject/providers'
import type { LastBlockNumber } from './libs/LastBlockNumber'
import { map, mergeMap, Subject, takeUntil } from 'rxjs'
import { filterApprovalEvents, filterLpEvents, filterMinAmountSwapLogs, filterStakingEvents, filterSwapLogs, transfersFilter } from './eventFilters'
import { humanizateApprovalLog, humanizateLpLog, humanizateStakingLog, humanizateSwapLog, humanizateTransferLog } from './humanizate'
import { watchLpLogs, watchStakingLogs, watchSwapLog, watchTransfers, SwapEvent } from './watchers'
import { targetToken } from './projects'
import { pairs } from './projects'
import { targetPriceFetcher } from './libs/TargetPriceFetcher'
import { stakingPools } from './projects'
import { watchBlock } from './watchers/block'
import { MessagePayloadType, tgBot } from './libs/TgBot'
import { watchApprovalLogs } from './watchers/approval'
import { addTransaction } from './transforms'
import { isLpWithTargetToken } from './utils/isLpWithTargetToken'

const pairsWithTargetToken = pairs.filter(isLpWithTargetToken)
const destroy$ = new Subject<void>()

export const watch = (wsProvider:BaseProvider, lastBlockNumber: LastBlockNumber) => {
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
  stakingPools.filter((pool) => (
    pool.earningToken.address === targetToken.address 
    || pool.stakingToken.address === targetToken.address 
    || (pool.stakingToken.type === 'LP-TOKEN' && isLpWithTargetToken(pool.stakingToken))
  )).forEach((stakingPool) => {
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
      await lastBlockNumber.saveBlockNumber(block.number)
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
