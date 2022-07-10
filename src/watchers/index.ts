import type { ApprovalTokenEvent } from './approval'
import type { BurnLpEvent, MintLpEvent } from './lp'
import type { RewardedEvent, StakedEvent, UnstakedEvent } from './stakingMultyContract'
import type { SwapEvent } from './swap'
import type { TransferEvent } from './watchTransfers'

export * from './lp'
export * from './stakingMultyContract'
export * from './swap'
export * from './watchTransfers'

export type AllEvents = SwapEvent | TransferEvent | MintLpEvent | BurnLpEvent | StakedEvent | UnstakedEvent | RewardedEvent | ApprovalTokenEvent
