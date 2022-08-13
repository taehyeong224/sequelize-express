import { setupDB } from "./db/setup";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import glob from "glob";

dotenv.config();
const app = express();

const { PORT } = process.env;

async function bootstrap() {
  const port = PORT || 3000;

  await setupDB();
  setMiddleware();
  await loadRouter();
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
