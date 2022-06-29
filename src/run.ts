import { BaseProvider } from '@ethersproject/providers'
import { pairs, project } from '@/projects'
import { targetPriceFetcher } from '@/libs/TargetPriceFetcher'
import { tgBot } from '@/libs/TgBot'
import { LastBlockNumber } from '@/libs/LastBlockNumber'
import { isLpWithTargetToken } from '@/utils/isLpWithTargetToken'
import { wsProviderController } from '@/utils/providers/WsProviderController'
import { watch } from '@/watch'
import { getBlock } from '@/watchers/block'
import { movingAverages, movingAveragesDays } from '@/movingAverage'
import { humanizateAnalysis } from '@/humanizate/humanizateAnalysis'
import { getTechnicalindicators } from '@/libs/technicalindicators'
import { getProvider } from '@/utils/providers/getProvider'

const provider = getProvider()

const init = async () => {
  const pairsWithTargetToken = pairs.filter(isLpWithTargetToken)

  await Promise.all([
    tgBot.launch(),
    targetPriceFetcher.fetchPrice(),
    targetPriceFetcher.fetchLpPriceAll(pairsWithTargetToken),
   // wsProviderController.connect(),
  ])

  //@ts-ignore
  tgBot.bot.command('hello', async (ctx) => {
    await ctx.deleteMessage(ctx.message.message_id)
    await tgBot.send({
      text: ctx.message.chat.id.toString(),
      chatId: ctx.message.chat.id.toString(),
    })
  })

  if (project.name === 'NMX') {
    //@ts-ignore
    tgBot.bot.command('av', async (ctx) => {
      getTechnicalindicators()
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
}

const run = async (wsProvider:BaseProvider) => {
  const lastBlockNumber = new LastBlockNumber(project.name)
  const currentBlock = await getBlock('latest')

  watch(wsProvider, lastBlockNumber)

  if (lastBlockNumber.lastBlock < currentBlock.number) {
    await tgBot.sendLog(
      `Последний прочитанный блок: ${lastBlockNumber.lastBlock}\nТекущий блок: ${currentBlock.number}\nПропущено блоков: ${currentBlock.number - lastBlockNumber.lastBlock}`
    )
  }

  //wsProviderController.once('connected', run)
}

run(provider)

init()
  //.then(() => wsProviderController.waitWsConnect())
  //.then(run)
  .catch((error) => {
    console.error(error)
    tgBot.sendLog('Main error \n'+JSON.stringify(error))
  })

// wsProviderController.on('connected', () => {
//   tgBot.sendLog('connected')
// })
// wsProviderController.on('error', (error) => {
//   tgBot.sendLog(JSON.stringify(error))
// })
// wsProviderController.on('disconnected', () => {
//   tgBot.sendLog('disconnected')
// })
