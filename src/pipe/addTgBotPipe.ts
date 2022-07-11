import type { BaseProvider } from '@ethersproject/providers'
import type { ProjectType } from '@/entries'
import { mergeMap } from 'rxjs'
import { TgBot } from '@/libs/TgBot'
import { humanizatePrivateChatFilters } from '@/humanizate/humanizatePrivateChatFilters'
import { humanizatePublicChatFilters } from '@/humanizate/humanizatePublicChatFilters'

export const addTgBotPipe = mergeMap(async (payload: {provider: BaseProvider, project:ProjectType}) => {
  const tgBot = new TgBot(payload.project.telegram.botToken)

  await tgBot.launch()

  const privateChatFiltersText = humanizatePrivateChatFilters(payload.project)
  const publicChatFiltersText = humanizatePublicChatFilters(payload.project)

  await tgBot.setChatDescription(
    payload.project.telegram.whalesChatId,
    privateChatFiltersText,
  )

  tgBot.bot.command('/private_chat_filters', async (ctx) => {
    await ctx.deleteMessage(ctx.message.message_id)
    await tgBot.send({
      chatId: ctx.chat.id.toString(),
      text: privateChatFiltersText,
    })
  })

  tgBot.bot.command('/public_chat_filters', async (ctx) => {
    await ctx.deleteMessage(ctx.message.message_id)
    await tgBot.send({
      chatId: ctx.chat.id.toString(),
      text: publicChatFiltersText,
    })
  })

  return { ...payload, tgBot }
})
