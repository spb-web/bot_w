import { getWalletName } from "@/projects"

export const getWalletString = (address: string) => {
  return `\`\`\`${getWalletName(address)}\`\`\``
}