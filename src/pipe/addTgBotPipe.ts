import type { BaseProvider } from '@ethersproject/providers'
import type { ProjectType } from '@/entries'
import { mergeMap } from 'rxjs'
import { TgBot } from '@/libs/TgBot'
import { humanizateChatDescription } from '@/humanizate/humanizateChatDescription'

export const addTgBotPipe = mergeMap(async (payload: {provider: BaseProvider, project:ProjectType}) => {
  const tgBot = new TgBot(payload.project.telegram.botToken)

  await tgBot.launch()

  const chatDescription = humanizateChatDescription(payload.project)

  await tgBot.setChatDescription(
    payload.project.telegram.whalesChatId,
    chatDescription,
  )

  tgBot.bot.command('/private_chat_filters', async (ctx) => {
    await tgBot.send({
      chatId: ctx.chat.id.toString(),
      text: chatDescription,
    })
  })

  return { ...payload, tgBot }
})
