import type { PairType, ProjectType } from '@/entries'
import { getProvider } from '../../utils/providers/getProvider'
import { getEventFilter, parseRawLpLog } from './helpers'

const provider = getProvider()

export const getLpLogs = async (project: ProjectType, pair:PairType, fromBlock:number, toBlock: number) => {
  const rawLogs = await provider.getLogs({
    fromBlock,
    toBlock,
    ...getEventFilter(pair.address)
  })

  const logs = rawLogs.map((rawLog) => parseRawLpLog(project, pair, rawLog))

  return logs
}
