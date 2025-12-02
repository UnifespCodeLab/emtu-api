import { Router } from "express";
import userController from "../controllers/userController";

const userRoutes = Router();

userRoutes.get("/admins", userController.getAll);
userRoutes.get("/admins/:id", userController.getUserById);
userRoutes.put("/admins/:id", userController.update);
userRoutes.delete("/admins/:id", userController.delete);
userRoutes.post("/register", userController.register);
userRoutes.post("/login", userController.login);

export { userRoutes }