import { BigNumber } from 'bignumber.js'

export const toLocaleString = (bn:BigNumber|number, b=false) => {
  let dec = 2

  if (BigNumber.isBigNumber(bn)) {
    if (bn.lte(0.001)) {
      dec = 8
    } else if (bn.lte(0.01)) {
      dec = 6
    } else if (bn.lte(1)) {
      dec = 4
    }
  } else {
    if (bn > 0.001) {
      dec = 8
    } else if (bn > 0.01) {
      dec = 6
    } else if (bn > 1) {
      dec = 4
    }
  }

  const str = Number(bn.toFixed(dec)).toLocaleString('ru-Ru')

  if (b) {
    return `***${str}***`
  }

  return str
}