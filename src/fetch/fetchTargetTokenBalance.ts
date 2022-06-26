import type { Call } from '@/utils/multicall'
import { BigNumber } from 'bignumber.js'
import asyncRetry from 'async-retry'
import { targetToken } from '@/projects'
import { getPoolByEarningTokenAndExhange } from '../utils/getPoolByEarningTokenAndExhange'
import multicall from '../utils/multicall'
import { StakingContractType } from '@/entries'

const TEN_BN = new BigNumber(10)
const targetTokenStakingPool = getPoolByEarningTokenAndExhange(targetToken.address)
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
  try {
    return asyncRetry(async () => {
      const calls:Call[] = [
        {
          name: 'balanceOf',
          address: targetToken.address,
          params: [address],
        },
      ]
  
      if (targetTokenStakingPool.contractType === StakingContractType.MULTY_CONTRCATS) {
        calls.push({
          name: 'stakers',
          address: targetTokenStakingPool.address,
          params: [address],
        })
      }
  
      let staked = new BigNumber(0)
  
      const returnData = await multicall(abi, calls)
      const [[rawBalance]] = returnData
      const balance = new BigNumber(rawBalance._hex).div(TEN_BN.pow(targetToken.decimals))
  
      if (targetTokenStakingPool.contractType === StakingContractType.MULTY_CONTRCATS) {
        const [{ amount: rawStaked }] = returnData
        staked = new BigNumber(rawStaked._hex).div(TEN_BN.pow(targetToken.decimals))
      }
  
      return {
        balance,
        staked,
      }
    }, {
      retries: 5,
      minTimeout: 500,
    })
  } catch (error) {
    console.error('[fetchTargetTokenBalance]: Error', 'targetTokenStakingPool', targetTokenStakingPool, )
    console.error(error)
    throw error 
  }
}
