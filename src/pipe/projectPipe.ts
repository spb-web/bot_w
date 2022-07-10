import type { ProjectEventType } from '@/entries'
import { filter, from, map, mergeMap, Subject, tap } from 'rxjs'
// import { filterApprovalEvents, filterLpEvents, filterMinAmountSwapLogs, filterStakingEvents, filterSwapLogs, transfersFilter } from '@/eventFilters'
import { AllEvents, watchLpLogs, watchStakingLogs, watchSwapLog, watchTransfers } from '@/watchers'
import { pairs } from '@/projects'
import { watchApprovalLogs } from '@/watchers/approval'
import { isLpWithTargetToken } from '@/utils/isLpWithTargetToken'

type Payload = Omit<ProjectEventType<any>, 'event'>

export const projectPipe = mergeMap(
  ({ provider, project, tgBot, priceFetcher }:Payload) => {
    const messagesSubject$ = new Subject<AllEvents>()

    // Handel transfers
    watchTransfers(provider, project.targetToken)
      .subscribe(messagesSubject$)

    const pairsWithTargetToken = from(pairs).pipe(filter(pair => isLpWithTargetToken(pair, project.targetToken)))

    
    // Handle swap
    pairsWithTargetToken
      .pipe(
        mergeMap((pair) => watchSwapLog(provider, project, pair)),
        tap(priceFetcher.handleSwapLog),
      )
      .subscribe(messagesSubject$)
      
    // Handle LP
    pairsWithTargetToken.pipe(
      mergeMap((pair) => watchLpLogs(provider, project, pair)),
    )
    .subscribe(messagesSubject$)


    // Handle staking
    from(project.stakingPools)
      .pipe(
        filter(pool => (
          pool.earningToken.address === project.targetToken.address 
          || pool.stakingToken.address === project.targetToken.address 
          || (pool.stakingToken.type === 'LP-TOKEN' && isLpWithTargetToken(pool.stakingToken, project.targetToken))
        )),
        mergeMap((stakingPool) => watchStakingLogs(provider, stakingPool)),
      )
      .subscribe(messagesSubject$)

    // Approve
    watchApprovalLogs(provider, project.targetToken)
      .subscribe(messagesSubject$)

    return messagesSubject$.pipe(
      map((event) => ({ event, provider, project, tgBot, priceFetcher }))
    )
  }
)
