import {ErrorCode} from "./ErrorCode";

export abstract class CustomError extends Error{
    code: ErrorCode
    constructor(message: string, code:ErrorCode) {
        super(message);
        this.code = code
    }
}