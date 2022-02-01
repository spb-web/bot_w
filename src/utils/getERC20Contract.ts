import { Contract } from 'ethers'
import memoizeOne from 'memoize-one'
import ERC20Abi from '../config/abi/ERC20.json'
import { getProvider } from './providers/getProvider'

export const getERC20Contract = memoizeOne((address: string) => {
  const provider = getProvider()

  return new Contract(address, ERC20Abi, provider)
})