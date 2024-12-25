import { User } from "src/modules/user/model/user.schema";

declare global {
    namespace Express {
        interface Request { 
            user?: User;
        }
    }
}