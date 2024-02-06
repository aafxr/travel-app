import {CustomError} from "./CustomError";
import {ErrorCode} from "./ErrorCode";

export class NetworkError extends CustomError{
    static connectionError(){
        return new NetworkError('Ошибка соединения', ErrorCode.NETWORK_ERROR)
    }
}