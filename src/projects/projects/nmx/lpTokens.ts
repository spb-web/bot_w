import { getPairByAddress } from '../../getPairByAddress'

export const lpTokens = {
  pancakeSwap: {
    usdtNmx: getPairByAddress('0x8D8B74EA95c0689ac84DdC702D2953C6b2e9f48B')
  },
  nomiswap: {
    usdtNmx: getPairByAddress('0xA5F2f22d3b4FcCf0fEe429e6a8AcFc376F5AFa22'),
    nmxBusd: getPairByAddress('0x01Ddfc73488eEBBf6D57EdAb4697a23897b93Ca2'),
    wbnbNmx: getPairByAddress('0x596f619600Da38acE164C9FAceE730c6dbE83C86'),
    wbnbUsdt: getPairByAddress('0xe2Bbf54Dc0ccDD0Cf6270f2aF2f62FF79903Bb27'),
    busdUsdt: getPairByAddress('0x8E50d726e2ea87a27fA94760D4e65d58C3aD8b44'),
    usdcUsdt: getPairByAddress('0xfC3a2AEfF7141D6ce7C2AfB2db6a9e676C2E18A7'),
    btcbUsdt: getPairByAddress('0xa830F3A087c9A642694f6eEa98778e1c70097754'),
    toncoinUsdc: getPairByAddress('0xDeB1ceFa9bb596A189f76C94FDB0352D5aC736b9'),
    solUsdc: getPairByAddress('0x5C551CA8F00E09888F0FD57C7f91CB420ad29999'),
    maticUsdt: getPairByAddress('0x996B28Dda11381466C9e410D0b63a313a0f31c6B'),
    dogeUsdt: getPairByAddress('0xDCbc1D9D48016b8d5F3B0F9045Eb3B72F38E6B93'),
    shibBusd: getPairByAddress('0x943B50018F1A8aa16ce24503eef3E53115103fb6'),
  }
}
