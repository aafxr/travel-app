import {CustomError} from "./CustomError";
import {ErrorCode} from "./ErrorCode";

export class UserError extends CustomError{
    static unauthorized(){
        return new UserError('Необходимо авторизоваться', ErrorCode.UNAUTHORIZED)
    }
}