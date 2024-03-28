import {CustomError} from "./CustomError";
import {ErrorCode} from "./ErrorCode";

/**
 * класс с набором статических методов для создания инстансов ошибки с кратким описанием и кодом ошибки
 */
export class ExpenseError extends CustomError {


    static permissionDenied() {
        return new ExpenseError(`Отказ в доступе на изменение расхода`, ErrorCode.EXPENSE_PERMISSION_DENIED)
    }

    static updateBeforeCreate() {
        return new ExpenseError(`Обновление до создания расхода`, ErrorCode.EXPENSE_UPDATE_BEFORE_CREATE)
    }
}