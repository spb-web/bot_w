import type { TelegramConfigType } from '@/entries'
import env from 'env-var'

export const telegram:TelegramConfigType = {
  whalesChatId: '-1001654929842',
  publicWhalesChatId: '-1001765444286',
  botToken: env.get('BSW_TELEGRAM_BOT_TOKEN').required().asString(),
}
