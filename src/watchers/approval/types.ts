import type BigNumber from 'bignumber.js'
import type { BaseTargetEvent, TokenType } from '@/entries'

export type ApprovalTokenEvent = Readonly<{
  name: 'Approval',
  owner: string,
  spender: string,
  amount: BigNumber,
  rawAmount: BigNumber,
  token: TokenType,
  exchageName: string,
}> & BaseTargetEvent
