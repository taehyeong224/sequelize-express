import { router } from 'express'
import { getUsers } from 'src/controller/UserController'

export function userRouter () {
  router.get('/user', getUsers)
  
  return router
}
