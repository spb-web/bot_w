import type { PairType, TokenType } from '@/entries'
import { pairs } from '../projects'
import { isStablecoin } from './isStablecoin'

export const getTokenPriceRoute = (token:TokenType, path:PairType[] = []):PairType[] => {
  const foundPair = pairs.find((pair) => (
    (
      pair.token0.address === token.address
      || pair.token1.address === token.address
    )
    && !path.includes(pair)
  ))

  if (!foundPair) {
    throw new Error('[getTokenPriceRoute]: can not find pair');
  }

  const baseToken = foundPair.token0.address === token.address
    ? foundPair.token1
    : foundPair.token0

  path.push(foundPair)

  if (isStablecoin(baseToken)) {
    return path
  }
  
  return getTokenPriceRoute(baseToken, path)
}