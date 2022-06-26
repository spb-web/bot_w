import type { ProjectType, StakingPoolType, TokenType } from '@/entries'
import env from 'env-var'
import * as nmx from './nmx'
import * as bsw from './bsw'

let currentProject:ProjectType
const PROJETC_NAME = env.get('PROJECT').required().asString()

switch (PROJETC_NAME) {
  case 'NMX': {
    currentProject = nmx
    break
  }

  case 'BSW': {
    currentProject = bsw
    break
  }

  default: {
    throw new Error(`Unknow PROJETC_NAME: ${PROJETC_NAME}`)
  }
}


export const stakingPools:ReadonlyArray<StakingPoolType> = currentProject.stakingPools

export const targetToken:TokenType = currentProject.targetToken

export const project = currentProject

export const limits = currentProject.limits
