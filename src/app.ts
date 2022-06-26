import moduleAlias from 'module-alias'

moduleAlias.addAlias('@', __dirname)

const run = async () => {
  (await import('dotenv-flow')).config()
  await import('./run')
} 

run()
