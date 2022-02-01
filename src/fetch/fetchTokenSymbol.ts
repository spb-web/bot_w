import { getERC20Contract } from '../utils/getERC20Contract'
import memoizeOne from 'memoize-one'

export const fetchTokenSymbol = memoizeOne(async (address:string) => {
  const contract = getERC20Contract(address)
  const symbol = await contract.symbol()

  return symbol
})
