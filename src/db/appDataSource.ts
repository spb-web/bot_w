import path from "path"
import { DataSource } from "typeorm"
import * as entities from './entities'

const AppDataSource = new DataSource({
  type: "sqlite",
  database: path.join(__dirname, '../..', 'runtime/db.sqlite'),
  busyErrorRetry: 1000,
  entities: Object.values(entities),
  synchronize: true,
})

export const initDb = () => AppDataSource.initialize()