import type { BaseTargetEvent, PairType } from "@/entries";
import type { BigNumber } from "bignumber.js";

export type SwapEvent = Readonly<{
  name: 'Swap',
  sender: string,
  amount0In: BigNumber,
  amount1In: BigNumber,
  amount0Out: BigNumber,
  amount1Out: BigNumber,
  to: string,
  pair: PairType,
}> & BaseTargetEvent
