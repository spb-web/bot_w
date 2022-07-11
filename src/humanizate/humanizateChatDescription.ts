import type { ProjectType } from "@/entries"
import { toLocaleString } from "@/utils/toLocaleString"

export const humanizateChatDescription = (project: ProjectType) => {
  return `
Private chat filters:

📩 Transfers: $${toLocaleString(project.limits.minTransferAmountPrice)} 
🐮🐻 Buy/Sell: $${toLocaleString(project.limits.minSwapAmountPrice)} 
🟢🔴 Mint/Burn liquidity: $${toLocaleString(project.limits.minLpAmountPrice)} 
👍👎 Deposit/Withdrawal: $${toLocaleString(project.limits.stakeLpAmountPrice)} 
🤝 Farming rewards: $${toLocaleString(project.limits.rewardAmountPrice)} 
  `.trim()
}