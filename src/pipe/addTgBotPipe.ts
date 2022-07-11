import type { BaseProvider } from '@ethersproject/providers'
import type { ProjectType } from '@/entries'
import { mergeMap } from 'rxjs'
import { TgBot } from '@/libs/TgBot'
import { humanizateChatDescription } from '@/humanizate/humanizateChatDescription'

export const addTgBotPipe = mergeMap(async (payload: {provider: BaseProvider, project:ProjectType}) => {
  const tgBot = new TgBot(payload.project.telegram.botToken)

  await tgBot.launch()

  await tgBot.setChatDescription(
    payload.project.telegram.whalesChatId,
    humanizateChatDescription(payload.project)
  )

  return { ...payload, tgBot }
})
