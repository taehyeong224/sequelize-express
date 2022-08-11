import { sequelize } from "../db/setup";
import Sq from 'sequelize'

export const User = sequelize.define(
  'user',
  {
    userName: Sq.STRING,
    password: Sq.STRING,

    createdAt: { type: Sq.DATE, defaultValue: Sq.NOW },
    updatedAt: { type: Sq.DATE, defaultValue: Sq.NOW },
  },
  {
    timestamps: true,
    freezeTableName: true,
  },
)
