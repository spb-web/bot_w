import type { TelegramConfigType } from '@/entries'
import env from 'env-var'

export const telegram:TelegramConfigType = {
  whalesChatId: '-1001654929842',
  logsChatId: '1981691657',
  botToken: env.get('TELEGRAM_BOT_TOKEN').required().asString(),
}
