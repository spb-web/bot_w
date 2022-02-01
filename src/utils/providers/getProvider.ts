import { JsonRpcProvider } from '@ethersproject/providers'
import memoizeOne from 'memoize-one'

export const getProvider = memoizeOne(
  () => new JsonRpcProvider('https://bsc-dataseed.binance.org/')
)