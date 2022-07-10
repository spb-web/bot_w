import type { TelegramConfigType } from '@/entries'
import env from 'env-var'

export const telegram:TelegramConfigType = {
  whalesChatId: '-1001520809718',
  publicWhalesChatId: '-1001765444286',
  botToken: env.get('NMX_TELEGRAM_BOT_TOKEN').required().asString(),
}
