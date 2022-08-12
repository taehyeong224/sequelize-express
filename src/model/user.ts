import Sq from "sequelize";
import { sequelize } from "../db/setup";

export const User = sequelize.define(
  "user",
  {
    userName: Sq.STRING,
    password: Sq.STRING,

    createdAt: { type: Sq.DATE, defaultValue: Sq.NOW },
    updatedAt: { type: Sq.DATE, defaultValue: Sq.NOW },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);
