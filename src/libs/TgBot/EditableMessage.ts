import type { Telegraf } from 'telegraf'
import { escape } from './helpers'

export class EditableMessage {
  private bot: Telegraf
  private messageId: number
  private chatId: number

  constructor(bot:Telegraf, chatId:number, messageId:number) {
    this.bot = bot
    this.messageId = messageId
    this.chatId = chatId
  }

  public editMessageText(text:string) {
    this.bot.telegram.editMessageText(
      this.chatId,
      this.messageId,
      undefined,
      escape(text),
    )
  }

  public async delete() {
    await this.bot.telegram.deleteMessage(this.chatId, this.messageId)
  }
}
