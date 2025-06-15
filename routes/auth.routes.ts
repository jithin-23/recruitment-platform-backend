import express from "express";
import AuthService from "../services/auth.service";
import AuthController from "../controllers/auth.controller";

const authRouter = express.Router()

const authService = new AuthService();
const authController = new AuthController(authService,authRouter);

export default authRouter;