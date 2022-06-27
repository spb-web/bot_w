import type { Log } from '@ethersproject/abstract-provider'
import { EventFilter } from 'ethers'
import type { TokenType } from '@/entries'
import type { ApprovalTokenEvent } from './types'
import { BigNumber } from 'bignumber.js'
import { hexZeroPad, id, Interface } from 'ethers/lib/utils'
import { getRouterByAddress } from '../../utils/getRouterByAddress'
import { routes } from '@/projects'

const abi = [
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
]

const tokenInterface = new Interface(abi)

export const getEventFilter = (address:string, spender:string|string[]|null = null):EventFilter => {
  const filter:EventFilter = {
    address,
    topics: [
      id('Approval(address,address,uint256)'),
      // @ts-ignore
      spender,
      Object.values(routes).map(router => hexZeroPad(router.address, 32))
    ]
  }

  return filter
}

export const parseRawApprovalLog = (token:TokenType, rawLog:Log) => {
  const log = tokenInterface.parseLog(rawLog)
  const rawAmountBn = new BigNumber(log.args[2]._hex)
  const amountBn = rawAmountBn.div(10**token.decimals)

  const approvalEvent:ApprovalTokenEvent = {
    name: 'Approval',
    owner: log.args[0],
    spender: log.args[1],
    amount: amountBn,
    rawAmount: rawAmountBn,
    token,
    rawLog,
    exchageName: getRouterByAddress(log.args[1]).exchangeName,
  }

  return approvalEvent
}
