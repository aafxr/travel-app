import {CustomError} from "./CustomError";
import {ErrorCode} from "./ErrorCode";

export class LimitError extends CustomError{

    static permissionDeniedChangeLimit(){
        return new LimitError('Отказ в дотупе на изменение лимита', ErrorCode.PERMISSION_DENIED_CHANGE_lIMIT)
    }

}