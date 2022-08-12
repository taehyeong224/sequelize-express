import { Router, Request, Response } from "express";
import { commonRequestHandler } from "../util/routerHandler";
import { getUsers } from "../controller/UserController";

const router = Router();

export default function userRouter() {
  router.get("/user", fetchUsers);

  async function fetchUsers(req: Request, res: Response) {
    try {
      const users = await getUsers();
      res.send(users);
    } catch (e) {
      commonRequestHandler(req, res, e);
    }
  }

  return router;
}
