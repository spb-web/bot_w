import type { BaseProvider } from '@ethersproject/providers'
import type { LastBlockNumber } from './libs/LastBlockNumber'
import { filter, from, map, mergeMap, Subject, takeUntil } from 'rxjs'
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

export const watch = (provider:BaseProvider, lastBlockNumber: LastBlockNumber) => {
  const messagesSubject$ = new Subject<MessagePayloadType>()

  // Handel transfers
  watchTransfers(provider, targetToken)
    .pipe(
      transfersFilter,
      mergeMap(addTransaction),
      map(humanizateTransferLog),
    )
    .pipe(takeUntil(destroy$))
    .subscribe(messagesSubject$)

  const pairsWithTargetToken = from(pairs).pipe(filter(pair => isLpWithTargetToken(pair)))

  const swapLogs = pairsWithTargetToken
    .pipe(mergeMap((pair) => watchSwapLog(provider, pair)))
    .pipe(takeUntil(destroy$))

  // Handle swap
  swapLogs
    .pipe(
      filterMinAmountSwapLogs,
      mergeMap(addTransaction),
      filterSwapLogs,
      map(humanizateSwapLog),
    )
    .pipe(takeUntil(destroy$))
    .subscribe(messagesSubject$)

  // Handle update prices
  swapLogs.subscribe(targetPriceFetcher.handleSwapLog)
    
  // Handle LP
  pairsWithTargetToken.pipe(
    mergeMap((pair) => watchLpLogs(provider, pair)),
    filterLpEvents,
    mergeMap(addTransaction),
    map(humanizateLpLog),
  )
  .pipe(takeUntil(destroy$))
  .subscribe(messagesSubject$)


  // Handle staking
  from(stakingPools)
    .pipe(
      filter(pool => (
        pool.earningToken.address === targetToken.address 
        || pool.stakingToken.address === targetToken.address 
        || (pool.stakingToken.type === 'LP-TOKEN' && isLpWithTargetToken(pool.stakingToken))
      )),
      mergeMap((stakingPool) => watchStakingLogs(provider, stakingPool)),
      filterStakingEvents,
      mergeMap(addTransaction),
      map(humanizateStakingLog),
    )
    .pipe(takeUntil(destroy$))
    .subscribe(messagesSubject$)

  // Approve
  watchApprovalLogs(provider, targetToken)
    .pipe(
      mergeMap(addTransaction),
      filterApprovalEvents,
      map(humanizateApprovalLog),
    )
    .pipe(takeUntil(destroy$))
    .subscribe(messagesSubject$)

  // Blocks number
  watchBlock(provider)
    .pipe(takeUntil(destroy$))
    .subscribe(async (block) => {
      await lastBlockNumber.saveBlockNumber(block.number)
    })

  // Telegram messages
  messagesSubject$
    .pipe(takeUntil(destroy$))
    .subscribe({
      next: (messagePayload) => tgBot.send(messagePayload),
      complete: () => tgBot.sendLog(`messagesSubject completed`),
      error: (error) => {
        console.error(error)

        destroy$.next()

        tgBot.sendLog(`messagesSubject error ${JSON.stringify(error?.message)}`)
      },
    })
}
