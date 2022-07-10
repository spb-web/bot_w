import env from 'env-var'
import type { BaseProvider } from '@ethersproject/providers'
import { allProjects } from '@/projects'
import { LastBlockNumber } from '@/libs/LastBlockNumber'
import { wsProviderController } from '@/utils/providers/WsProviderController'
import { projectPipe } from '@/pipe/projectPipe'
import { getBlock, watchBlock } from '@/watchers/block'
import { movingAverages, movingAveragesDays } from '@/movingAverage'
import { humanizateAnalysis } from '@/humanizate/humanizateAnalysis'
import { getTechnicalindicators } from '@/libs/technicalindicators'
import { getProvider } from '@/utils/providers/getProvider'
import { from, mergeMap, tap } from 'rxjs'
import { addTransactionPipe } from './pipe/addTransactionPipe'
import { telegramMessagePipe } from './pipe/telegramMessagePipe'
import { filterMinimum } from './pipe/filterMinimum'
import { filterWithBalance } from './pipe/filterWithBalance'
import { addTgBotPipe } from './pipe/addTgBotPipe'
import { telegramMessageTargetPipe } from './pipe/telegramMessageTargetPipe'
import { TgBot } from './libs/TgBot'
import { addPriceFetcherPipe } from './pipe/addPriceFetcherPipe'

const provider = getProvider()
const whalesBotFatherToken = env.get('WHALES_FATHER_TELEGRAM_BOT_TOKEN').required().asString()
const whalesBotFather = new TgBot(whalesBotFatherToken)

const init = async () => {
  await Promise.all([
    whalesBotFather.launch(),
   // wsProviderController.connect(),
  ])

  // if (project.name === 'NMX') {
  //   //@ts-ignore
  //   tgBot.bot.command('av', async (ctx) => {
  //     getTechnicalindicators()
  //     await ctx.deleteMessage(ctx.message.message_id)
  //     const analysis = {
  //       currentPrice: movingAverages[10].lastValue(),
  //       movingAverages: movingAveragesDays.map((days) => {
  //         return {
  //           days,
  //           movingAverage: movingAverages[days].movingAverage(),
  //         }
  //       }),
  //     }
  //     await tgBot.send(
  //       humanizateAnalysis(
  //         analysis,
  //         ctx.chat.id.toString()
  //       )
  //     )
  //   })
  // }
}

const run = async (provider:BaseProvider) => {
  const lastBlockNumber = new LastBlockNumber()
  const currentBlock = await getBlock('latest')

  // Blocks number
  watchBlock(provider)
    .subscribe(async (block) => {
      await lastBlockNumber.saveBlockNumber(block.number)
    })

  from(allProjects.map((project => ({ provider, project })))).pipe(
    addTgBotPipe,
    addPriceFetcherPipe,
    projectPipe,
    filterMinimum,
    addTransactionPipe,
    filterWithBalance,
    telegramMessagePipe,
    telegramMessageTargetPipe,
    tap(({ tgBot, tgMessage, tgMessageChatId }) => tgBot.send({ ...tgMessage, chatId: tgMessageChatId }))
  ).subscribe()

  if (lastBlockNumber.lastBlock < currentBlock.number) {
    await whalesBotFather.sendLog(
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
    whalesBotFather.sendLog('Main error \n'+JSON.stringify(error))
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
