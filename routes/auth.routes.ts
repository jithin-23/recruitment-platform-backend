import express from "express";
import AuthService from "../services/auth.service";
import AuthController from "../controllers/auth.controller";
import { personService } from "../services/person.service";
import { employeeService } from "../services/employee.service";

const authRouter = express.Router()

const authService = new AuthService(personService,employeeService);
const authController = new AuthController(authService,authRouter);

export default authRouter;