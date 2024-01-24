import {CustomError} from "./CustomError";
import {ErrorCode} from "./ErrorCode";

export  class ExpenseError extends CustomError{

    static unexpectedTravelId(travelId: string){
        return new ExpenseError(`Путешествие с id="${travelId}" не найдино`, ErrorCode.UNEXPECTED_TRAVEL_ID)
    }

    static permissionDenied(){
        return new ExpenseError(`Отказ в доступе на изменение расхода`, ErrorCode.EXPENSE_PERMISSION_DENIED)
    }
}