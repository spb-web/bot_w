import { BytesLike, ethers } from 'ethers'
import { getMulticallContract } from './getMulticallContract'

export type MultiCallResponse<T> = T | null

export interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (example: balanceOf)
  params?: any[] // Function params
}

const multicall = async <T = any>(abi: any[], calls: Call[]): Promise<T> => {
  const multi = getMulticallContract()
  const itf = new ethers.utils.Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
  const { returnData } = await multi.functions.aggregate(calldata)
  const res = returnData.map((call:BytesLike, i:number) => itf.decodeFunctionResult(calls[i].name, call))

  return res
}

export default multicall
