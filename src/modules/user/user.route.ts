import { Router, type Request, type Response } from "express";
import { pool } from "../../db";
import { userController } from "./user.controller";

const router = Router()

router.get('/', userController.getUsers)

router.get('/:id', userController.getUserById)

router.put('/:id', userController.updateUserById)

router.delete('/:id', userController.deleteUserById)

router.post('/', userController.createUser)


export const userRouter = router;