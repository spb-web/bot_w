import { stablesCoins } from '../projects'
import { TokenType } from '../entries'

const stableCoinsAddresses = stablesCoins.map((token) => token.address)

export const isStablecoin = (token: TokenType):boolean => (
  stableCoinsAddresses.includes(token.address)
)
