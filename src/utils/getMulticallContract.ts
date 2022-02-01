import { Contract } from 'ethers'
import { getProvider } from './providers/getProvider'
import multicallAbi from '../config/abi/multicall.json'

export const getMulticallContract = () => {
  const provider = getProvider()

  return new Contract('0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B', multicallAbi, provider)
}
