import { Contract } from 'ethers'
import memoizeOne from 'memoize-one'
import pairAbi from '../config/abi/pairAbi.json'
import { getProvider } from './providers/getProvider'

export const getPairContract = memoizeOne((address: string) => {
  const provider = getProvider()

  return new Contract(address, pairAbi, provider)
})