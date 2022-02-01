import env from 'env-var'

export const whalesChatId = '-1001520809718'
export const logsChatId = '1981691657'
export const botToken = env.get('TELEGRAM_BOT_TOKEN').required().asString()
