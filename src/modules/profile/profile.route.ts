import { Router } from "express";
import { profileController } from "./profile.controller";


const route = Router()

route.get('/', profileController.getAllProfile)
route.get('/:id', profileController.getProfile)
route.post('/', profileController.createProfile)



export const profileRoute = route