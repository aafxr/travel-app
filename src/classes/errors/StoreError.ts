import {CustomError} from "./CustomError";
import {ErrorCode} from "./ErrorCode";

export class StoreError extends CustomError{

    static addAlredyExistingRecord(storeName: string, record: any){
        const po = JSON.stringify(record)
        return new StoreError(`
        Запись в хранилище "${storeName}" уже существует.
        
        ${po}
        `, ErrorCode.STORE_RECORD_ALREDY_EXIST)
    }
}