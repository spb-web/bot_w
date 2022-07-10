import type { TelegramConfigType } from '@/entries'
import env from 'env-var'

export const telegram:TelegramConfigType = {
  whalesChatId: '1981691657', // '-1001520809718',
  publicWhalesChatId: '1981691657',
  botToken: env.get('NMX_TELEGRAM_BOT_TOKEN').required().asString(),
}
