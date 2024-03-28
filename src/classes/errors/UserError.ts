import {CustomError} from "./CustomError";
import {ErrorCode} from "./ErrorCode";


/**
 * класс с набором статических методов для создания инстансов ошибки с кратким описанием и кодом ошибки
 */
export class UserError extends CustomError{
    static unauthorized(){
        return new UserError('Необходимо авторизоваться', ErrorCode.UNAUTHORIZED)
    }

    static updateBeforeCreate(){
        return new UserError('Обновление пользователя до создания', ErrorCode.USER_UPDATE_BEFORE_CREATE)
    }
}