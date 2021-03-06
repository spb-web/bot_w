import type { PairType } from '@/entries'
import { tokens } from './tokens'

export const pairs:ReadonlyArray<PairType> = [
  // Nomiswap [BEGIN]
  {
    token0: tokens.usdt,
    token1: tokens.nmx,
    symbol: 'USDT-NMX LP',
    address: '0x8D8B74EA95c0689ac84DdC702D2953C6b2e9f48B',
    exchangeName: 'PancakeSwap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.usdt,
    token1: tokens.nmx,
    symbol: 'USDT-NMX LP',
    address: '0xA5F2f22d3b4FcCf0fEe429e6a8AcFc376F5AFa22',
    exchangeName: 'Nomiswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.nmx,
    token1: tokens.busd,
    symbol: 'NMX-BUSD LP',
    address: '0x01Ddfc73488eEBBf6D57EdAb4697a23897b93Ca2',
    exchangeName: 'Nomiswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.wbnb,
    token1: tokens.nmx,
    symbol: 'WBNB-NMX LP',
    address: '0x596f619600Da38acE164C9FAceE730c6dbE83C86',
    exchangeName: 'Nomiswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.usdt,
    token1: tokens.wbnb,
    symbol: 'USDT-WBNB LP',
    address: '0xe2Bbf54Dc0ccDD0Cf6270f2aF2f62FF79903Bb27',
    exchangeName: 'Nomiswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.usdt,
    token1: tokens.busd,
    symbol: 'USDT-BUSD LP',
    address: '0x8E50d726e2ea87a27fA94760D4e65d58C3aD8b44',
    exchangeName: 'Nomiswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.usdt,
    token1: tokens.usdc,
    symbol: 'USDT-USDC LP',
    address: '0xfC3a2AEfF7141D6ce7C2AfB2db6a9e676C2E18A7',
    exchangeName: 'Nomiswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.usdt,
    token1: tokens.btcb,
    symbol: 'USDT-BTCB LP',
    address: '0xa830F3A087c9A642694f6eEa98778e1c70097754',
    exchangeName: 'Nomiswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.toncoin,
    token1: tokens.usdc,
    symbol: 'TONCOIN-USDC LP',
    address: '0xDeB1ceFa9bb596A189f76C94FDB0352D5aC736b9',
    exchangeName: 'Nomiswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.sol,
    token1: tokens.usdc,
    symbol: 'SOL-USDC LP',
    address: '0x5C551CA8F00E09888F0FD57C7f91CB420ad29999',
    exchangeName: 'Nomiswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.usdt,
    token1: tokens.matic,
    symbol: 'USDT-MATIC LP',
    address: '0x996B28Dda11381466C9e410D0b63a313a0f31c6B',
    exchangeName: 'Nomiswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.usdt,
    token1: tokens.doge,
    symbol: 'USDT-DOGE LP',
    address: '0xDCbc1D9D48016b8d5F3B0F9045Eb3B72F38E6B93',
    exchangeName: 'Nomiswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.shib,
    token1: tokens.busd,
    symbol: 'SHIB-BUSD LP',
    address: '0x943B50018F1A8aa16ce24503eef3E53115103fb6',
    exchangeName: 'Nomiswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.usdc,
    token1: tokens.nmx,
    symbol: 'USDC-NMX LP',
    address: '0xdFB9cAb9f44355963588bc26b9633996Ce8c0D80',
    exchangeName: 'Nomiswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  // Nomiswap [END]

  // Biswap [BEGIN]
  {
    token0: tokens.bsw,
    token1: tokens.wbnb,
    symbol: 'BSW-WBNB LP',
    address: '0x46492B26639Df0cda9b2769429845cb991591E0A',
    exchangeName: 'Biswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.bsw,
    token1: tokens.bfg,
    symbol: 'BSW-BFG LP',
    address: '0x88d483697F8E3FC8f5674F322d3a59ce786aCcD5',
    exchangeName: 'Biswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  {
    token0: tokens.usdt,
    token1: tokens.bsw,
    symbol: 'USDT-BSW LP',
    address: '0x2b30c317ceDFb554Ec525F85E79538D59970BEb0',
    exchangeName: 'Biswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  // Biswap [END]

  // Libera Financial [BEGIN]
  {
    token0: tokens.libera,
    token1: tokens.busd,
    symbol: 'LIBERA-BUSD LP',
    address: '0x22D954CA5540caB869AdA9bd9d339CDE3a9313b3',
    exchangeName: 'Biswap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  // Libera Financial [END]

  // Ape Swap [BEGIN]
  {
    token0: tokens.banana,
    token1: tokens.busd,
    symbol: 'BANANA-BUSD LP',
    address: '0x7Bd46f6Da97312AC2DBD1749f82E202764C0B914',
    exchangeName: 'ApeSwap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  // Ape Swap [END]

  // Baby Swap [BEGIN]
  {
    token0: tokens.babyswap,
    token1: tokens.usdt,
    symbol: 'BABY-USDT LP',
    address: '0xE730C7B7470447AD4886c763247012DfD233bAfF',
    exchangeName: 'BabySwap',
    type: 'LP-TOKEN',
    decimals: 18,
  },
  // Baby Swap [END]
]
