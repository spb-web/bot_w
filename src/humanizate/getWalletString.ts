import type { AddressInfoType } from "@/entries"
import { getWalletName } from "@/projects"
import lodash from 'lodash'

export const getWalletString = (address: string, addressesInfo:Record<string, AddressInfoType>) => {
  const isContract = lodash.get(addressesInfo, [address, 'isContract'], null)
  let emoji = isContract ? '📃 ' : ''

  return `${emoji}\`\`\`${getWalletName(address)}\`\`\``
}