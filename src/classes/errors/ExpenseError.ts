import {CustomError} from "./CustomError";
import {ErrorCode} from "./ErrorCode";

/**
 * класс с набором статических методов для создания инстансов ошибки с кратким описанием и кодом ошибки
 */
export  class ExpenseError extends CustomError{



    static permissionDenied(){
        return new ExpenseError(`Отказ в доступе на изменение расхода`, ErrorCode.EXPENSE_PERMISSION_DENIED)
    }
}