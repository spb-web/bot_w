import type { ProjectEventType } from '@/entries'
import { TargetPriceFetcher } from '@/libs/TargetPriceFetcher'
import { pairs } from '@/projects'
import { isLpWithTargetToken } from '@/utils/isLpWithTargetToken'
import { mergeMap } from 'rxjs'

type Payload = Omit<ProjectEventType<any>, 'event'|'priceFetcher'>

export const addPriceFetcherPipe = mergeMap(async (payload: Payload) => {
    const priceFetcher = new TargetPriceFetcher(
      payload.project.targetToken,
      pairs.filter((lpToken) => isLpWithTargetToken(lpToken, payload.project.targetToken))
    )
  
    await Promise.all([
      priceFetcher.fetchLpPriceAll(),
      priceFetcher.fetchPrice()
    ])
  
    return { ...payload, priceFetcher }
  })
  