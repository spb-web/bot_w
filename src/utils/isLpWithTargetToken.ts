import type { PairType, TokenType } from '@/entries'

export const isLpWithTargetToken = (pair:TokenType | PairType, targetToken: TokenType) => {
  return (
    pair.type === 'LP-TOKEN'
    && (
      pair.token0.address === targetToken.address
      || pair.token1.address === targetToken.address
    )
  )
}