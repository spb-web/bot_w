import env from 'env-var'

export const whalesBotFatherToken = env.get('WHALES_FATHER_TELEGRAM_BOT_TOKEN').required().asString()
