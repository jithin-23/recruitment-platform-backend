import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import HttpException from "../exception/httpException";
import { LoggerService } from "../services/logger.service";
import AuthService from "../services/auth.service";

class AuthController {
    private logger = LoggerService.getInstance(AuthController.name);
    constructor(private authService: AuthService, private router: Router) {
        router.post("/login", this.login.bind(this));
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                throw new HttpException(400, "Enter email and password");
            }
            const data = await this.authService.login(email, password);
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }
}

export default AuthController;
