import "dotenv/config";
import { JwtPayload } from "jsonwebtoken";
import HttpException from "../exception/httpException";
import { LoggerService } from "./logger.service";
import jwt from "jsonwebtoken";

class AuthService {
    constructor() {}
    private logger = LoggerService.getInstance(AuthService.name);

    async login(email: string, password: string) {
        const user = { id: 123, email: "abc", password: "pass", role: "ADMIN" };

        if (!user) throw new HttpException(404, "No such user found");
        if (password !== user.password)
            throw new HttpException(400, "Incorrect password entry");

        const payload: JwtPayload = {
            personId: user.id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: parseInt(process.env.JWT_VALIDITY),
        });

        this.logger.info(
            `Login succesful for user:${user.email} with role:${user.role}`
        );

        return {
            tokenType: "Bearer",
            accessToken: token,
        };
    }
}

export default AuthService;
