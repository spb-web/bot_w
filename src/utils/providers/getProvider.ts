import { jsonRpcUrl } from '@/config/constants/rpcNode'
import { JsonRpcProvider } from '@ethersproject/providers'
import memoizeOne from 'memoize-one'

export const getProvider = memoizeOne(
  () => new JsonRpcProvider(jsonRpcUrl)
)