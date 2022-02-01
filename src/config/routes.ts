import type { RouterType } from '@/entries'

export const routes:Readonly<Record<string, RouterType>> = {
  'pancakeV1': {
    address: '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F',
    exchangeName: 'Pancake',
  },
  'pancakeProxyV1': {
    address: '0x7E54F740C14cA8398871F5042Df8cE6DAB1E1f09',
    exchangeName: 'Pancake',
  },
  'nomiswap': {
    address: '0xD654953D746f0b114d1F85332Dc43446ac79413d',
    exchangeName: 'Nomiswap',
  },
  '1inch': {
    address: '0x1111111254fb6c44bAC0beD2854e76F90643097d',
    exchangeName: '1Inch',
  },
}