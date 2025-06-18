import { CustomJwtPayload } from "../dto/jwt-payload";

declare global{
    namespace Express{
        interface Request{
            user?:CustomJwtPayload
        }
    }
}
