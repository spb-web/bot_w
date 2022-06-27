import type { BaseProvider } from '@ethersproject/providers'
import type { LastBlockNumber } from './libs/LastBlockNumber'
import { concatAll, filter, from, map, mergeMap, Subject, takeUntil } from 'rxjs'
import { filterApprovalEvents, filterLpEvents, filterMinAmountSwapLogs, filterStakingEvents, filterSwapLogs, transfersFilter } from './eventFilters'
import { humanizateApprovalLog, humanizateLpLog, humanizateStakingLog, humanizateSwapLog, humanizateTransferLog } from './humanizate'
import { watchLpLogs, watchStakingLogs, watchSwapLog, watchTransfers } from './watchers'
import { targetToken } from './projects'
import { pairs } from './projects'
import { targetPriceFetcher } from './libs/TargetPriceFetcher'
import { stakingPools } from './projects'
import { watchBlock } from './watchers/block'
import { MessagePayloadType, tgBot } from './libs/TgBot'
import { watchApprovalLogs } from './watchers/approval'
import { addTransaction } from './transforms'
import { isLpWithTargetToken } from './utils/isLpWithTargetToken'

const destroy$ = new Subject<void>()

export const watch = (wsProvider:BaseProvider, lastBlockNumber: LastBlockNumber) => {
  destroy$.next()

  const messagesSubject$ = new Subject<MessagePayloadType>()

  // Handel transfers
  watchTransfers(wsProvider, targetToken)
    .pipe(
      transfersFilter,
      mergeMap(addTransaction),
      map(humanizateTransferLog),
      takeUntil(destroy$)
    )
    .subscribe(messagesSubject$)

  const pairsWithTargetToken = from(pairs).pipe(filter(pair => isLpWithTargetToken(pair)))

  const swapLogs = pairsWithTargetToken.pipe(
    map((pair) => watchSwapLog(wsProvider, pair)),
    concatAll(),
    filterMinAmountSwapLogs,
    mergeMap(addTransaction),
    takeUntil(destroy$),
  )

  // Handle swap
  swapLogs
    .pipe(
      filterSwapLogs,
      map(humanizateSwapLog),
      takeUntil(destroy$),
    )
    .subscribe(messagesSubject$)

  // Handle update prices
  swapLogs.subscribe(targetPriceFetcher.handleSwapLog)
    
  // Handle LP
  pairsWithTargetToken.pipe(
    map((pair) => watchLpLogs(wsProvider, pair)),
    concatAll(),
    filterLpEvents,
    mergeMap(addTransaction),
    map(humanizateLpLog),
    takeUntil(destroy$)
  )
  .subscribe(messagesSubject$)


  // Handle staking
  from(stakingPools)
    .pipe(
      filter(pool => (
        pool.earningToken.address === targetToken.address 
        || pool.stakingToken.address === targetToken.address 
        || (pool.stakingToken.type === 'LP-TOKEN' && isLpWithTargetToken(pool.stakingToken))
      )),
      map((stakingPool) => watchStakingLogs(wsProvider, stakingPool)),
      concatAll(),
      filterStakingEvents,
      mergeMap(addTransaction),
      map(humanizateStakingLog),
      takeUntil(destroy$)
    )
    .subscribe(messagesSubject$)

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
