import {CustomError} from "./CustomError";
import {ErrorCode} from "./ErrorCode";

export  class ExpenseError extends CustomError{



    static permissionDenied(){
        return new ExpenseError(`Отказ в доступе на изменение расхода`, ErrorCode.EXPENSE_PERMISSION_DENIED)
    }
}