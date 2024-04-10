import { setupDB } from "./db/setup";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import glob from "glob";
import dayjs from "dayjs";
import { Request, Response } from "express";
import { CommonError } from "./util/errorModel";
import { elaClient } from "./db/elasticConfig";
import { ELASTICSEARCH_INDEX_NAME } from "./util/constList";

dotenv.config();
const app = express();

const { PORT } = process.env;

async function connectElasticSearch() {
  try {
    const ping = await elaClient.ping();
    console.log("ping : ", ping);
    const exist = await elaClient.indices.exists({
      index: ELASTICSEARCH_INDEX_NAME,
    });
    !exist
      ? await createElasticIndex()
      : console.log("index test already exist");
    console.log("elasticsearch connect");
  } catch (e) {
    console.error("elasticsearch connect error : ", e);
  }
}

async function createElasticIndex() {
  try {
    await elaClient.indices.create({
      index: ELASTICSEARCH_INDEX_NAME,
    });
  } catch (e) {
    console.error("createElasticIndex error : ", e);
  }
}
async function bootstrap() {
  const port = PORT || 3000;

  await setupDB();
  await connectElasticSearch();
  setMiddleware();
  await loadRouter();
  setErrorHandler();
  setErrorMiddleware();
  app.listen(port, () => console.log("start"));
}

function setMiddleware() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}

function setErrorMiddleware() {
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("server error");
  });
}

function setErrorHandler() {
  app.use(function (error: Error, req: Request, res: Response) {
    console.error(
      `[${dayjs().format("YYYY-MM-DD[T]HH:mm:ss+09:00")}] ${req.method} ${
        req.originalUrl
      } ${error.message}`
    );

    if (error instanceof CommonError) {
      return res.status(error.statusCode).json({
        code: error.errorCode,
        statusCode: error.statusCode,
        message: error.getErrorMessage(),
      });
    }
    res.status(500).json({ msg: "server error" });
  });
}

async function loadRouter() {
  const routePath = __dirname + "/router/*.js";
  console.log("routePath = ", routePath);
  for (const file of glob.sync(routePath)) {
    const { default: route } = await import(path.resolve(file));
    console.log("route : ", route);
    app.use(`/`, route());
  }
}

(async () => {
  await bootstrap();

  process.on("uncaughtException", (err) => {
    console.error("whoops! There was an uncaught error:", err);
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    console.error("whoops! There was an uncaught error:", err);
    process.exit(1);
  });
})();
