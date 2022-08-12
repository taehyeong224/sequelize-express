import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import glob from "glob";

dotenv.config();

const { ALTER_TABLE, MYSQL, MYSQL_HOST } = process.env;

export const sequelize = new Sequelize(MYSQL, { dialect: "mysql" });

export async function setupDB() {
  console.log("setupDB");
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (e) {
    if (e.message.indexOf("Unknown database") >= 0) {
      const sq = new Sequelize(MYSQL_HOST, { dialect: "mysql" });
      await sq.query(
        "CREATE DATABASE test CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
      );
    }
  }

  await syncDB();
}

async function syncDB() {
  console.log("syncDB");
  const modelPath = __dirname + "/../model/*.js";
  for (const file of glob.sync(modelPath)) {
    const model = await import(path.resolve(file));
    console.log("model : ", model.User);
    await model.User.sync({ alter: ALTER_TABLE === "true" });
  }
  // await sequelize.sync({ alter: ALTER_TABLE === "true" });
  ALTER_TABLE === "true" && console.log("sync success");
}
