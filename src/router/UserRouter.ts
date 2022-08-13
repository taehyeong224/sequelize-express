import { Router, Request, Response } from "express";
import { commonRequestHandler } from "../util/routerHandler";
import {
  changeUser,
  createUser,
  getUsers,
  removeUser,
} from "../controller/UserController";
import { throwIfInvalid } from "src/util/validate";
import joi from "joi";

const router = Router();

export default function userRouter() {
  router.get("/user", fetchUsers);
  router.post("/user", postUser);
  router.patch("/user/:userId", patchUser);
  router.delete("/user/:userId", deleteUser);

  async function fetchUsers(req: Request, res: Response) {
    try {
      const users = await getUsers();
      res.send(users);
    } catch (e) {
      commonRequestHandler(req, res, e);
    }
  }

  async function postUser(req: Request, res: Response) {
    try {
      const { userName, password } = throwIfInvalid(
        req.body,
        joi.object({
          userName: joi.string().required(),
          password: joi.string().required(),
        })
      );
      await createUser({ userName, password });
      res.send({ msg: "success" });
    } catch (e) {
      commonRequestHandler(req, res, e);
    }
  }

  async function patchUser(req: Request, res: Response) {
    try {
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
    } catch (e) {
      commonRequestHandler(req, res, e);
    }
  }

  async function deleteUser(req: Request, res: Response) {
    try {
      const { userId } = throwIfInvalid(
        req.params,
        joi.object({
          userId: joi.number().positive().required(),
        })
      );

      await removeUser(userId);
      res.send({ msg: "success" });
    } catch (e) {
      commonRequestHandler(req, res, e);
    }
  }

  return router;
}
