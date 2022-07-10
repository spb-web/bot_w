import type { BaseToken } from '@/entries'

export const isEqualTokens = (token0: BaseToken, token1: BaseToken) => {
  return token0.address.toLocaleLowerCase() === token1.address.toLocaleLowerCase()
}
