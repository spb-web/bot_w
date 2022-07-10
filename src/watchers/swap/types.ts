import type { BaseTargetEvent, PairType, TokenType } from "@/entries";
import type { BigNumber } from "bignumber.js";

export enum SwapSide {
  SELL,
  BUY,
}

export type SwapEvent = Readonly<{
  name: 'Swap',
  eventData: {
    sender: string,
    amount0In: BigNumber,
    amount1In: BigNumber,
    amount0Out: BigNumber,
    amount1Out: BigNumber,
    to: string,
    pair: PairType,
    side: SwapSide,
    targetAmount: BigNumber,
    pairedAmount: BigNumber,
    targetToken: TokenType,
    pairedToken: TokenType,
  }
}> & BaseTargetEvent
