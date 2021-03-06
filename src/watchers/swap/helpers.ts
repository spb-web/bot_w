import type { PairType, ProjectType } from '@/entries'
import type { EventFilter } from 'ethers'
import type { Log } from '@ethersproject/abstract-provider'
import type { SwapEvent } from './types'
import { SwapSide } from './types'
import { id, Interface } from 'ethers/lib/utils'
import { BigNumber } from 'bignumber.js'
import { isEqualTokens } from '@/utils/isEqualTokens'

const abi = [
  'event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)'
]

const pairInterface = new Interface(abi)

export const getEventFilter = (address:string):EventFilter => {
  const filter:EventFilter = {
    address,
    topics: [ id('Swap(address,uint256,uint256,uint256,uint256,address)') ]
  }

  return filter
}

export const parseRawSwapLog = (project: ProjectType, pair:PairType, rawLog:Log):SwapEvent => {
  const log = pairInterface.parseLog(rawLog)
  const amount0InBn = new BigNumber(log.args[1]._hex).div(10**18)
  const amount1InBn = new BigNumber(log.args[2]._hex).div(10**18)
  const amount0OutBn = new BigNumber(log.args[3]._hex).div(10**18)
  const amount1OutBn = new BigNumber(log.args[4]._hex).div(10**18)

  let side: SwapSide
  let targetAmount: BigNumber
  let pairedAmount: BigNumber

  const pairedToken = isEqualTokens(pair.token0, project.targetToken)
    ? pair.token1 : pair.token0

  if (isEqualTokens(pair.token0, project.targetToken)) {
    if (amount0InBn.gt(0)) {
      side = SwapSide.SELL
      targetAmount = amount0InBn
      pairedAmount = amount1OutBn
    } else {
      side = SwapSide.BUY
      targetAmount = amount0OutBn
      pairedAmount = amount1InBn
    } 
  } else if (amount1InBn.gt(0)) {
    side = SwapSide.SELL
    targetAmount = amount1InBn
    pairedAmount = amount0OutBn
  } else {
    side = SwapSide.BUY
    targetAmount = amount1OutBn
    pairedAmount = amount0InBn
  }

  const swapLog:SwapEvent = {
    name: 'Swap',
    eventData: {
      sender: log.args[0],
      amount0In: amount0InBn,
      amount1In: amount1InBn,
      amount0Out: amount0OutBn,
      amount1Out: amount1OutBn,
      to: log.args[5],
      pair,
      side,
      targetAmount,
      pairedAmount,
      pairedToken,
      targetToken: project.targetToken,
    },
    rawLog,
  }

  return swapLog
}