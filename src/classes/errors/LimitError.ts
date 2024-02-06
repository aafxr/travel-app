import {CustomError} from "./CustomError";
import {ErrorCode} from "./ErrorCode";

export class LimitError extends CustomError{

    static permissionDeniedChangeLimit(){
        return new LimitError('Отказ в дотупе на изменение лимита', ErrorCode.PERMISSION_DENIED_CHANGE_LIMIT)
    }

    static limitPlanMustBeGreaterThen(value:number, currencySymbol?:string){
        return new LimitError(`Лимит должен быть больше либо раве запланированным расходам. Минимальное значение: ${value} ${currencySymbol || ''}`,ErrorCode.LOW_LIMIT_VALUE)
    }

}