import { sequelize } from './db/setup'
import { Sequelize } from 'sequelize'
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import glob from 'glob'

dotenv.config()
const app = express()

const { PORT, ALTER_TABLE, MYSQL_HOST } = process.env

async function bootstrap () {
  const port = PORT || 3000

  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    await sequelize.sync({ alter: ALTER_TABLE === 'true' })
  } catch (err) {
    if (err.message.indexOf('Unknown database') >= 0) {
      const sq = new Sequelize(MYSQL_HOST, { dialect: 'mysql' })
      await sq.query(`CREATE DATABASE test;`)
      await sequelize.sync({ alter: ALTER_TABLE === 'true' })
      console.log('success ')
    }
  }
  await loadRouter()
  app.listen(port, () => console.log('start'))
}

async function loadRouter () {
  const routePath = __dirname + '/router/*.js'
  console.log('routePath = ', routePath)
  for (const file of glob.sync(routePath)) {
    const { default: route } = await import(path.resolve(file))
    console.log('route : ', route)
    app.use(`/`, route())
  }
}

(async () => {
  await bootstrap()
  
  process.on('uncaughtException', async (err) => {
    console.error('whoops! There was an uncaught error:', err)
    sequelize.close()
    process.exit(1)
  })

  process.on('unhandledRejection', async (err: any) => {
    console.error('whoops! There was an uncaught error:', err)
    sequelize.close()
    process.exit(1)
  })

})()
