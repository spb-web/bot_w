import type { PairType } from '@/entries'
import { getProvider } from '../../utils/providers/getProvider'
import { getEventFilter, parseRawLpLog } from './helpers'

const provider = getProvider()

export const getLpLogs = async (pair:PairType, fromBlock:number, toBlock: number) => {
  const rawLogs = await provider.getLogs({
    fromBlock,
    toBlock,
    ...getEventFilter(pair.address)
  })

  const logs = rawLogs.map((rawLog) => parseRawLpLog(pair, rawLog))

  return logs
}
