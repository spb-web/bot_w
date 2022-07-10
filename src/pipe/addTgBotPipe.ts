import type { BaseProvider } from '@ethersproject/providers'
import type { ProjectType } from '@/entries'
import { TgBot } from '@/libs/TgBot'
import { mergeMap } from 'rxjs'

export const addTgBotPipe = mergeMap(async (payload: {provider: BaseProvider, project:ProjectType}) => {
  const tgBot = new TgBot(payload.project.telegram.botToken)

  await tgBot.launch()

  return { ...payload, tgBot }
})
