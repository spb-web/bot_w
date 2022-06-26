import { StakingPoolType } from '@/entries'
import { stakingPools } from '../projects'

export const getPoolByEarningTokenAndExhange = (earningTokenAddress:string, exchangeName?:string):StakingPoolType => {
  const foundPool = stakingPools.find(
    (pool) => pool.earningToken.address === earningTokenAddress && (!exchangeName || pool.exchangeName === exchangeName)
  )

  if (!foundPool) {
    throw new Error(`[getPoolByEarningTokenAndExhange]: not found stakingPool by earning token address ${JSON.stringify(earningTokenAddress)} and exchangeName ${JSON.stringify(exchangeName)}`);
  }

  return foundPool
}
