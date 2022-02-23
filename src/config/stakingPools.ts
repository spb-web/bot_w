import type { StakingPoolType } from '@/entries'
import { lpTokens } from './lpTokens'
import { tokens } from './tokens'

export const stakingPools:ReadonlyArray<StakingPoolType> = [
  {
    address: '0x9Cd2D1A3214c12BB6dbfA7DBc3B0641C26a2f9a6',
    stakingToken: lpTokens.pancakeSwap.usdtNmx,
    earningToken: tokens.nmx,
    exchangeName: 'Nominex',
    name: 'USDT-NMX',
  },
  {
    address: '0x2D8b192eAd2f402867323B072D143d44435EDd74',
    stakingToken: lpTokens.nomiswap.usdtNmx,
    earningToken: tokens.nmx,
    exchangeName: 'Nomiswap',
    name: 'USDT-NMX',
  },
  {
    address: '0xDbF1B10FE3e05397Cd454163F6F1eD0c1181C3B3',
    stakingToken: tokens.nmx,
    earningToken: tokens.nmx,
    exchangeName: 'Nomiswap',
    name: 'NMX',
  },
  {
    address: '0x857083580AeD7b5726860937EF030ED8072BC9aB',
    stakingToken: lpTokens.nomiswap.nmxBusd,
    earningToken: tokens.nmx,
    exchangeName: 'Nomiswap',
    name: 'NMX-BUSD',
  },
  {
    address: '0x5cd67d65Ff07D5BE2488E51F1a8C69273D258338',
    stakingToken: lpTokens.nomiswap.wbnbNmx,
    earningToken: tokens.nmx,
    exchangeName: 'Nomiswap',
    name: 'WBNB-NMX',
  },
  {
    address: '0x8326E22a36486ae7D4B85e8DFA732527b962805c',
    stakingToken: lpTokens.nomiswap.wbnbUsdt,
    earningToken: tokens.nmx,
    exchangeName: 'Nomiswap',
    name: 'WBNB-USDT',
  },
  {
    address: '0x8326E22a36486ae7D4B85e8DFA732527b962805c',
    stakingToken: lpTokens.nomiswap.busdUsdt,
    earningToken: tokens.nmx,
    exchangeName: 'Nomiswap',
    name: 'BUSD-USDT',
  },
  {
    address: '0xd8925c88B94513be760AD88BC10D780d58fA001D',
    stakingToken: lpTokens.nomiswap.usdcUsdt,
    earningToken: tokens.nmx,
    exchangeName: 'Nomiswap',
    name: 'USDC-USDT',
  },
  {
    address: '0xA937Eddfd12930F758788BcC936B4762BDE9d54C',
    stakingToken: lpTokens.nomiswap.btcbUsdt,
    earningToken: tokens.nmx,
    exchangeName: 'Nomiswap',
    name: 'BTCB-USDT',
  },
  {
    address: '0x5c317770bf9A7d7cC88974A97fFA92C209669bFE',
    stakingToken: lpTokens.nomiswap.toncoinUsdc,
    earningToken: tokens.nmx,
    exchangeName: 'Nomiswap',
    name: 'TONCOIN-USDC',
  },
  {
    address: '0x26804231a528c894AB6790530b237449a817da6A',
    stakingToken: lpTokens.nomiswap.solUsdc,
    earningToken: tokens.nmx,
    exchangeName: 'Nomiswap',
    name: 'SOL-USDC',
  },
  {
    address: '0x63A81d936cb14fA3649A4D071608758cFFb3Bd94',
    stakingToken: lpTokens.nomiswap.maticUsdt,
    earningToken: tokens.nmx,
    exchangeName: 'Nomiswap',
    name: 'MATIC-USDT',
  },
  {
    address: '0xA0F2C13e20A11e00acF4e7B47604b24ca8908797',
    stakingToken: lpTokens.nomiswap.dogeUsdt,
    earningToken: tokens.nmx,
    exchangeName: 'Nomiswap',
    name: 'DOGE-USDT',
  },
  {
    address: '0x03868d2e45a9b579Cc68B7addd65Cf78Ddb62a68',
    stakingToken: lpTokens.nomiswap.shibBusd,
    earningToken: tokens.nmx,
    exchangeName: 'Nomiswap',
    name: 'SHIB-BUSD',
  },
]
