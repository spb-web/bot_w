import { WebSocketProvider } from '@ethersproject/providers'
import { pairs } from './config/pairs'
import { targetPriceFetcher } from './libs/TargetPriceFetcher'
import { tgBot } from './libs/TgBot'
import { lastBlockNumber } from './libs/LastBlockNumber'
import { isLpWithTargetToken } from './utils/isLpWithTargetToken'
import { wsProviderController } from './utils/providers/WsProviderController'
import { watch } from './watch'
import { getBlock } from './watchers/block'
import { movingAverages, movingAveragesDays } from './movingAverage'
import { humanizateAnalysis } from './humanizate/humanizateAnalysis'

const init = async () => {
  const pairsWithTargetToken = pairs.filter(isLpWithTargetToken)

  await Promise.all([
    tgBot.launch(),
    targetPriceFetcher.fetchPrice(),
    targetPriceFetcher.fetchLpPriceAll(pairsWithTargetToken),
    wsProviderController.connect(),
  ])

  tgBot.handleCommand('av', async (ctx) => {
    await ctx.deleteMessage(ctx.message.message_id)
    const analysis = {
      currentPrice: movingAverages[10].lastValue(),
      movingAverages: movingAveragesDays.map((days) => {
        return {
          days,
          movingAverage: movingAverages[days].movingAverage(),
        }
      }),
    }
    await tgBot.send(
      humanizateAnalysis(
        analysis,
        ctx.chat.id.toString()
      )
    )
  })
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
