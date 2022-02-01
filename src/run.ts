import { WebSocketProvider } from '@ethersproject/providers'
import { pairs } from './config/pairs'
import { targetPriceFetcher } from './libs/TargetPriceFetcher'
import { tgBot } from './libs/TgBot'
import { lastBlockNumber } from './libs/LastBlockNumber'
import { isLpWithTargetToken } from './utils/isLpWithTargetToken'
import { wsProviderController } from './utils/providers/WsProviderController'
import { watch } from './watch'
import { getBlock } from './watchers/block'

const init = async () => {
  const pairsWithTargetToken = pairs.filter(isLpWithTargetToken)

  await Promise.all([
    tgBot.launch(),
    targetPriceFetcher.fetchPrice(),
    targetPriceFetcher.fetchLpPriceAll(pairsWithTargetToken),
    wsProviderController.connect(),
  ])
}

const run = async (wsProvider:WebSocketProvider) => {
  const currentBlock = await getBlock('latest')

  watch(wsProvider)

  if (lastBlockNumber.get() < currentBlock.number) {
    await tgBot.sendLog(
      `Последний прочитанный блок: ${lastBlockNumber.get()}\nТекущий блок: ${currentBlock.number}\nПропущено блоков: ${currentBlock.number - lastBlockNumber.get()}`
    )
  }

  wsProviderController.once('connected', run)
}

init()
  .then(() => wsProviderController.waitWsConnect())
  .then(run)
  .catch((error) => {
    console.error(error)
    tgBot.sendLog('Main error \n'+JSON.stringify(error))
  })

wsProviderController.on('connected', () => {
  tgBot.sendLog('connected')
})
wsProviderController.on('error', (error) => {
  tgBot.sendLog(JSON.stringify(error))
})
wsProviderController.on('disconnected', () => {
  tgBot.sendLog('disconnected')
})
