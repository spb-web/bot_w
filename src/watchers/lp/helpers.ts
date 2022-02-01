import type { Log } from '@ethersproject/abstract-provider'
import type { EventFilter } from 'ethers'
import type { PairType } from '@/entries'
import type { BurnLpEvent, MintLpEvent } from './types'
import BigNumber from 'bignumber.js'
import { id, Interface } from 'ethers/lib/utils'

export const getEventFilter = (address:string):EventFilter => {
  const filter:EventFilter = {
    address,
    topics: [
      [
        id('Mint(address,uint256,uint256)'),
        id('Burn(address,uint256,uint256,address)'),
      ]
    ]
  }

  return filter
}

const abi = [
  'event Mint(address indexed sender, uint amount0, uint amount1)',
  'event Burn(address indexed sender, uint amount0, uint amount1, address indexed to)',
]

const pairInterface = new Interface(abi)

export const parseRawLpLog = (pair:PairType, rawLog:Log) => {
  const log = pairInterface.parseLog(rawLog)
  const amount0Bn = new BigNumber(log.args[1]._hex).div(10**pair.token0.decimals)
  const amount1Bn = new BigNumber(log.args[2]._hex).div(10**pair.token1.decimals)

  switch (log.name) {
    case 'Mint': {
      const mintLpEvent:MintLpEvent = {
        name: 'Mint',
        sender: log.args[0],
        amount0: amount0Bn,
        amount1: amount1Bn,
        pair,
        rawLog,
      }

      return mintLpEvent
    } 
    
    case 'Burn': {
      const burnLpEvent:BurnLpEvent = {
        name: 'Burn',
        sender: log.args[0],
        amount0: amount0Bn,
        amount1: amount1Bn,
        to: log.args[3],
        pair,
        rawLog,
      }

      return burnLpEvent
    } 
    default: {
      throw new Error(`[processRawLpLogs]: Unknow log.name=${JSON.stringify(log.name)}`)
    }
  }
}
