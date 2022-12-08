import { Router } from "express";
import userController from "../controllers/userController";

const userRoutes = Router();

userRoutes.post("/register", userController.register);

export { userRoutes }