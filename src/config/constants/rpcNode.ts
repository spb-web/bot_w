import env from 'env-var'

export const wsRpcUrl = env.get('WS_RPC_URL').required().asString()
export const jsonRpcUrl = env.get('JSON_RPC_URL').required().asString()
