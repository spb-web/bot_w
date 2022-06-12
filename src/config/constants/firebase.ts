import env from 'env-var'

export const firebaseApiKey = env.get('FIERBASE_API_KEY').required().asString()
