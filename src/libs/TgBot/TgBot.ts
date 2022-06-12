import type { ExtraReplyMessage } from 'telegraf/typings/telegram-types'
import type { Message } from 'telegraf/typings/core/types/typegram'
import { Telegraf } from 'telegraf'
import { botToken, logsChatId } from '../../config/constants/telegram'
import { EditableMessage } from './EditableMessage'
import { escape } from './helpers'


export type MessagePayloadType = {
  text: string,
  extra?: ExtraReplyMessage,
  chatId: string,
  source?: Buffer
}

export class TgBot {
  private bot:Telegraf

  constructor(botToken:string) {
    this.bot = new Telegraf(botToken)

    // Enable graceful stop
    process.once('SIGINT', () => this.bot.stop('SIGINT'))
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'))
  }

  public async launch() {
    await this.bot.launch()
  }

  public async sendLog(text:string) {
    await this.send({
      chatId: logsChatId,
      text
    })
  }
  
  public async send(payload:MessagePayloadType):Promise<Message.TextMessage|Message.PhotoMessage> {
    let message:Message.TextMessage|Message.PhotoMessage 
    
    if (payload.source) {
      message = await this.bot.telegram.sendPhoto(
        payload.chatId,
        { source: payload.source },
        {
          caption: escape(payload.text),
          parse_mode: 'MarkdownV2',
          ...payload.extra,
        },
      )
    } else {
      message = await this.bot.telegram.sendMessage(
        payload.chatId,
        escape(payload.text),
        { parse_mode: 'MarkdownV2', ...payload.extra, }
      )
    }

    return message
  }

  public async createEditableMessage(payload:MessagePayloadType) {
    const message = await this.send(payload)

    return new EditableMessage(this.bot, message.chat.id, message.message_id)
  }

  public handleCommand(...params: Parameters<typeof this.bot.command>) {
    this.bot.command(...params)
  }
}

export const tgBot = new TgBot(botToken)
