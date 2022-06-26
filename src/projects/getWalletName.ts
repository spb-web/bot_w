import { walletsNames } from './wallets'

export const getWalletName = (address:string) => {
  if (Object.hasOwnProperty.call(walletsNames, address)) {
    return walletsNames[address] as string
  }

  return address
}
