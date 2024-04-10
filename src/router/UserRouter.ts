import { Router, Request, Response } from "express";
import {
  changeUser,
  createUser,
  getUsers,
  loginUser,
  removeUser,
} from "../controller/UserController";
import { throwIfInvalid } from "../util/validate";
import joi from "joi";
import { verifyBearerToken } from "../middleware/auth";
import { asyncMiddleware } from "../middleware/errorHandler";

const router = Router();

export default function userRouter() {
  router.get("/user", verifyBearerToken, asyncMiddleware(fetchUsers));
  router.post("/user", verifyBearerToken, asyncMiddleware(postUser));
  router.post("/usercreate", asyncMiddleware(postUser));
  router.post("/user/login", asyncMiddleware(postLoginUser));
  router.patch("/user/:userId", verifyBearerToken, asyncMiddleware(patchUser));
  router.delete(
    "/user/:userId",
    verifyBearerToken,
    asyncMiddleware(deleteUser)
  );

  async function fetchUsers(req: Request, res: Response) {
    const users = await getUsers();
    res.send(users);
  }

  async function postUser(req: Request, res: Response) {
    const { userName, password } = throwIfInvalid(
      req.body,
      joi.object({
        userName: joi.string().required(),
        password: joi.string().required(),
      })
    );
    await createUser({ userName, password });
    res.send({ msg: "success" });
  }

  async function patchUser(req: Request, res: Response) {
    const { userId } = throwIfInvalid(
      req.params,
      joi.object({
        userId: joi.number().positive().required(),
      })
    );
    const { userName, password } = throwIfInvalid(
      req.body,
      joi.object({
        userName: joi.string(),
        password: joi.string(),
      })
    );
    await changeUser(userId, { userName, password });
    res.send({ msg: "success" });
  }

  async function deleteUser(req: Request, res: Response) {
    const { userId } = throwIfInvalid(
      req.params,
      joi.object({
        userId: joi.number().positive().required(),
      })
    );

    await removeUser(userId);
    res.send({ msg: "success" });
  }

  async function postLoginUser(req: Request, res: Response) {
    const { userName, password } = throwIfInvalid(
      req.body,
      joi.object({
        userName: joi.string().required(),
        password: joi.string().required(),
      })
    );
    const tokens = await loginUser(userName, password);
    res.send(tokens);
  }

  return router;
}
