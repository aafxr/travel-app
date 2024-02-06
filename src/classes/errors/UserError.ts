import {CustomError} from "./CustomError";
import {ErrorCode} from "./ErrorCode";


/**
 * класс с набором статических методов для создания инстансов ошибки с кратким описанием и кодом ошибки
 */
export class UserError extends CustomError{
    static unauthorized(){
        return new UserError('Необходимо авторизоваться', ErrorCode.UNAUTHORIZED)
    }
}