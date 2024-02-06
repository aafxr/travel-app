import {CustomError} from "./CustomError";
import {ErrorCode} from "./ErrorCode";


/**
 * класс с набором статических методов для создания инстансов ошибки с кратким описанием и кодом ошибки
 */
export class NetworkError extends CustomError{
    static connectionError(){
        return new NetworkError('Ошибка соединения', ErrorCode.NETWORK_ERROR)
    }
}