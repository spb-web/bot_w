import BigNumber from 'bignumber.js'

export const toLocaleString = (bn:BigNumber, b=false) => {
  const str = Number(bn.toFixed(2)).toLocaleString('ru-Ru')

  if (b) {
    return `***${str}***`
  }

  return str
}