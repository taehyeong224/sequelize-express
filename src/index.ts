import { sequelize } from './db/setup'
import { Sequelize } from 'sequelize'
import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const { PORT, ALTER_TABLE } = process.env

async function bootstrap () {
  const port = PORT || 3000
  const app = express()

  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    await sequelize.sync({ alter: ALTER_TABLE === 'true' })
  } catch (err) {
    console.error('eeee : ', err)
    if (err.message.indexOf('Unknown database') >= 0) {
      const sequelize = new Sequelize()
      await sequelize.query(`CREATE DATABASE test;`)
      await sequelize.sync({ alter: ALTER_TABLE === 'true' })
    }
  }

  app.listen(port, () => console.log('start'))
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
