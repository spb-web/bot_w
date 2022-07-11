import type { TokenType } from '@/entries'

export const tokens:Readonly<Record<string, TokenType>> = {
  nmx: {
    symbol: 'NMX',
    address: '0xd32d01A43c869EdcD1117C640fBDcfCFD97d9d65',
    decimals: 18,
    type: 'TOKEN',
  },
  bsw: {
    symbol: 'BSW',
    address: '0x965F527D9159dCe6288a2219DB51fc6Eef120dD1',
    decimals: 18,
    type: 'TOKEN',
  },
  usdt: {
    symbol: 'USDT',
    address: '0x55d398326f99059fF775485246999027B3197955',
    decimals: 18,
    type: 'TOKEN',
  },
  busd: {
    symbol: 'BUSD',
    address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    decimals: 18,
    type: 'TOKEN',
  },
  wbnb: {
    symbol: 'WBNB',
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    decimals: 18,
    type: 'TOKEN',
  },
  usdc: {
    symbol: 'USDC',
    address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    decimals: 18,
    type: 'TOKEN',
  },
  btcb: {
    symbol: 'BTCB',
    address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
    decimals: 18,
    type: 'TOKEN',
  },
  toncoin: {
    symbol: 'TONCOIN',
    address: '0x76A797A59Ba2C17726896976B7B3747BfD1d220f',
    decimals: 18,
    type: 'TOKEN',
  },
  sol: {
    symbol: 'SOL',
    address: '0x570A5D26f7765Ecb712C0924E4De545B89fD43dF',
    decimals: 18,
    type: 'TOKEN',
  },
  matic: {
    symbol: 'MATIC',
    address: '0xCC42724C6683B7E57334c4E856f4c9965ED682bD',
    decimals: 18,
    type: 'TOKEN',
  },
  doge: {
    symbol: 'DOGE',
    address: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
    decimals: 18,
    type: 'TOKEN',
  },
  shib: {
    symbol: 'SHIB',
    address: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D',
    decimals: 18,
    type: 'TOKEN',
  },
  bfg: {
    symbol: 'BFG',
    address: '0xBb46693eBbEa1aC2070E59B4D043b47e2e095f86',
    decimals: 18,
    type: 'TOKEN',
  },
  libera: {
    symbol: 'LIBERA',
    address: '0x3A806A3315E35b3F5F46111ADb6E2BAF4B14A70D',
    decimals: 18,
    type: 'TOKEN',
  },
  banana: {
    symbol: 'BANANA',
    address: '0x603c7f932ED1fc6575303D8Fb018fDCBb0f39a95',
    decimals: 18,
    type: 'TOKEN',
  },
  babyswap: {
    symbol: 'BABY',
    address: '0x53E562b9B7E5E94b81f10e96Ee70Ad06df3D2657',
    decimals: 18,
    type: 'TOKEN',
  }
}

export const stablesCoins = [
  tokens.usdt,
  tokens.busd,
  tokens.usdc,
]
