import type { Call } from '@/utils/multicall'
import BigNumber from 'bignumber.js'
import asyncRetry from 'async-retry'
import { targetToken } from '../config/tokens'
import { getERC20Contract } from '../utils/getERC20Contract'
import { getPoolByNameAndExhange } from '../utils/getPoolByNameAndExhange'
import multicall from '../utils/multicall'

const TEN_BN = new BigNumber(10)
const targetTokenStakingPool = getPoolByNameAndExhange('NMX', 'Nomiswap')
const abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "stakers",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint128",
        "name": "initialRewardRate",
        "type": "uint128"
      },
      {
        "internalType": "uint128",
        "name": "reward",
        "type": "uint128"
      },
      {
        "internalType": "uint256",
        "name": "claimedReward",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
]

export const fetchTargetTokenBalance = (address:string):Promise<{balance: BigNumber, staked: BigNumber}> => {
  return asyncRetry(async () => {
    const calls:Call[] = [
      {
        name: 'balanceOf',
        address: targetToken.address,
        params: [address],
      },
      {
        name: 'stakers',
        address: targetTokenStakingPool.address,
        params: [address],
      }
    ]

    const [[rawBalance], { amount: rawStaked }] = await multicall(abi, calls)
    const balance = new BigNumber(rawBalance._hex).div(TEN_BN.pow(targetToken.decimals))
    const staked = new BigNumber(rawStaked._hex).div(TEN_BN.pow(targetToken.decimals))

    return {
      balance,
      staked,
    }
  }, {
    retries: 5,
    minTimeout: 500,
  })
}
