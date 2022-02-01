import type { PairType } from '@/entries'
import { targetToken } from '../config/tokens'

export const isLpWithTargetToken = (pair:PairType) => {
  return (
    pair.token0.address === targetToken.address
    || pair.token1.address === targetToken.address
  )
}