import {ErrorCode} from "./ErrorCode";


/**
 * абстракция для представления информации о ошибке
 */
export abstract class CustomError extends Error{
    code: ErrorCode
    constructor(message: string, code:ErrorCode) {
        super(message);
        this.code = code
    }
}