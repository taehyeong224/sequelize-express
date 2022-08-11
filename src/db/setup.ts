import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize('test', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
})
