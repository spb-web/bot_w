import { stablesCoins } from '../config/tokens'
import { TokenType } from '../entries'

const stableCoinsAddresses = stablesCoins.map((token) => token.address)

export const isStablecoin = (token: TokenType):boolean => (
  stableCoinsAddresses.includes(token.address)
)
