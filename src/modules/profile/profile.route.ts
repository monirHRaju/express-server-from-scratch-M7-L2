import { Router } from "express";
import { profileController } from "./profile.controller";


const route = Router()

route.get('/:id', profileController.getProfile)

export const profileRoute = route