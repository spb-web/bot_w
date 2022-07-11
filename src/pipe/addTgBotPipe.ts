import type { BaseProvider } from '@ethersproject/providers'
import type { ProjectType } from '@/entries'
import { mergeMap } from 'rxjs'
import { TgBot } from '@/libs/TgBot'
import { humanizatePrivateChatFilters } from '@/humanizate/humanizatePrivateChatFilters'
import { humanizatePublicChatFilters } from '@/humanizate/humanizatePublicChatFilters'
import { BotDialogEntity } from '@/db/entities'

export const addTgBotPipe = mergeMap(async (payload: {provider: BaseProvider, project:ProjectType}) => {
  const tgBot = new TgBot(payload.project.telegram.botToken)

  await tgBot.launch()

  const botId = tgBot.bot.botInfo?.id.toString()

  if (!botId) {
    throw new Error('[addTgBotPipe]: botId is undefined')
  }

  const privateChatFiltersText = humanizatePrivateChatFilters(payload.project)
  const publicChatFiltersText = humanizatePublicChatFilters(payload.project)

  try {
    await tgBot.setChatDescription(
      payload.project.telegram.whalesChatId,
      privateChatFiltersText,
    )
  } catch (error) {
    
  }

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

  tgBot.bot.on('message', async (ctx) => {
    if (ctx.chat.type !== 'private') {
      return
    }

    await tgBot.send({
      chatId: ctx.chat.id.toString(),
      text: 'https://t.me/defi_whales_chat',
      extra: { parse_mode: 'HTML' }
    })
    await ctx.forwardMessage(tgBot.adminChatId)

    await BotDialogEntity.upsert(
      { chatId: ctx.chat.id.toString(), botId },
      { conflictPaths: ['chatId', 'botId'], skipUpdateIfNoValuesChanged: true }
    )
  })

  return { ...payload, tgBot }
})
