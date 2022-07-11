import type { ProjectType } from "@/entries"
import { toLocaleString } from "@/utils/toLocaleString"

export const humanizatePublicChatFilters = (project: ProjectType) => {
  return `
  Public chat filters:
  
  📩 Transfers: $${toLocaleString(project.publicLimits.minTransferAmountPrice)} 
  🐮🐻 Buy/Sell: $${toLocaleString(project.publicLimits.minSwapAmountPrice)} 
  🟢🔴 Mint/Burn liquidity: $${toLocaleString(project.publicLimits.minLpAmountPrice)} 
  👍👎 Deposit/Withdrawal: $${toLocaleString(project.publicLimits.stakeLpAmountPrice)} 
  🤝 Farming rewards: $${toLocaleString(project.publicLimits.rewardAmountPrice)} 
    `.trim()
}
