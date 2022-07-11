import type { ProjectType } from "@/entries"
import { toLocaleString } from "@/utils/toLocaleString"

export const humanizateChatDescription = (project: ProjectType) => {
  return `
- 📩 Transfers: $${toLocaleString(project.limits.minTransferAmountPrice)} \n
- 🐮🐻 Swaps: $${toLocaleString(project.limits.minSwapAmountPrice)} \n
- 🔴🟢 Mint/Burn liquidity: $${toLocaleString(project.limits.minLpAmountPrice)}  \n
- 👍👎 Deposit/Withdrawal: $${toLocaleString(project.limits.stakeLpAmountPrice)}  \n
- 🤝 Farming rewards: $${toLocaleString(project.limits.rewardAmountPrice)} \n
  `.trim()
}