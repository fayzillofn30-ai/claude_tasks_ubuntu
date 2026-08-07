import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import checkToken from "../middlewares/validation/checkToken.js";
import { registenValidate, loginValidate, permissionValidate, updatnValidate,  } from "../middlewares/validation/validate.middlewares.js";
import {jwtMIdllwares} from "../middlewares/responsehandlers/jwtMIdllwares.js";
import {responseHadlers} from "../middlewares/responsehandlers/responseHadlers.js";


const user_router = Router()

user_router.post("/register", registenValidate, UserController.createUser, jwtMIdllwares)
user_router.get("/all",UserController.getAllUsers, responseHadlers)
user_router.post("/login", loginValidate, UserController.signUser, jwtMIdllwares)
user_router.delete("/logout",UserController.deleteUser, responseHadlers )
export default user_router