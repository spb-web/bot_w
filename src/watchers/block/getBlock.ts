import { getProvider } from "../../utils/providers/getProvider"

const provider = getProvider()

export const getBlock = async (blockHashOrBlockTag='latest') => {
  const blockWithTransactions = await provider.getBlockWithTransactions(blockHashOrBlockTag)

  return blockWithTransactions
}
