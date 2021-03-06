import type { PairType } from '@/entries'
import { pairs } from './pairs'

export const getPairByAddress = (address: string):PairType => {
  const foundPair = pairs.find(pair => pair.address === address)

  if (!foundPair) {
    throw new Error(`[getPairByAddress]: can not find pair by address ${address}`);
  }

  return foundPair
}
