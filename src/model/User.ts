import Sq from "sequelize";
import { sequelize } from "../db/setup";
import { elaClient } from "../db/elasticConfig";
import { TABLE_NAME, ELASTICSEARCH_INDEX_NAME } from "../util/constList";

export const User = sequelize.define(
  TABLE_NAME.USER,
  {
    userName: Sq.STRING,
    password: Sq.STRING,
    isDelete: {
      type: Sq.BOOLEAN,
      defaultValue: false,
    },
    salt: Sq.STRING,
    createdAt: { type: Sq.DATE, defaultValue: Sq.NOW },
    updatedAt: { type: Sq.DATE, defaultValue: Sq.NOW },
  },
  {
    timestamps: true,
    freezeTableName: true,
    hooks: {
      afterCreate: (user: any, options) => {
        elaClient.create({
          index: ELASTICSEARCH_INDEX_NAME,
          document: {
            table: TABLE_NAME.USER,
            userName: user.userName,
            password: user.password,
            isDelete: user.isDelete,
            salt: user.salt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          id: user.id,
        });
      },
    },
  }
);
