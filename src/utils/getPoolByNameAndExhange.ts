import { StakingPoolType } from '@/entries'
import { stakingPools } from '../config/stakingPools'

export const getPoolByNameAndExhange = (name:string, exchangeName:string):StakingPoolType => {
  const foundPool = stakingPools.find(
    (pool) => pool.name === name && pool.exchangeName === exchangeName
  )

  if (!foundPool) {
    throw new Error(`[getPoolByNameAndExhange]: not found stakingPool by name "${JSON.stringify(name)}" and exchangeName "${JSON.stringify(name)}"`);
  }

  return foundPool
}
