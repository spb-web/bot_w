import type { ExtraReplyMessage } from 'telegraf/typings/telegram-types'
import type { Message } from 'telegraf/typings/core/types/typegram'
import PQueue from 'p-queue'
import delay from 'delay'
import { Telegraf } from 'telegraf'
import { project } from '@/projects'
import { escape } from './helpers'

const { telegram: { botToken, logsChatId } } = project

export type MessagePayloadType = {
  text: string,
  extra?: ExtraReplyMessage,
  chatId: string,
  source?: Buffer
}

export class TgBot {
  public readonly bot:Telegraf
  private queue = new PQueue({ concurrency: 1, autoStart: true })

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
      text,
      extra: {
        parse_mode: 'HTML',
      }
    })
  }
  
  public async send(payload:MessagePayloadType):Promise<Message.TextMessage|Message.PhotoMessage> {
    return new Promise((resolve, reject) => {      
      this.queue.add(async () => {
        let message:Message.TextMessage|Message.PhotoMessage 

        try {
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

          resolve(message)
          
          await delay(2000)
        } catch (error) {
          reject(error)

          throw error
        }
      })
    })
  }
}

export const tgBot = new TgBot(botToken)
