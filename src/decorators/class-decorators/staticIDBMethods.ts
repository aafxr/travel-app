interface WithDTOMethod{
    dto: () => Object
}

export interface StaticIDBMethodsInterface<T>{
    add(data:T, user_id: string, success?: Function, error?: Function): void
    getOne(id:IDBValidKey, success:(data:T | undefined) => void, error: (e: Error) => void): void
    getMany(range:IDBKeyRange, success:(data:T[]) => void, error: (e: Error) => void): void
    getAll(success:(data:T[]) => void, error: (e: Error) => void):void
    getOneFromIndex(index: keyof T, query: IDBValidKey, success:(data:T | undefined) => void, error: (e: Error) => void): void
    getManyFromIndex(index: keyof T, query: IDBKeyRange, success:(data:T[]) => void, error: (e: Error) => void): void
    getAllFromIndex(index: keyof T, success:(data:T[]) => void, error: (e: Error) => void): void
    update(data:T, user_id: string, success?: Function, error?: Function): void
    delete(id:IDBValidKey, user_id: string, success?: Function, error?: Function): void
}









export function staticIDBMethods<T extends {new(...args: any[]): WithDTOMethod}>(OriginClass: T): T & StaticIDBMethodsInterface<T> {
    return class extends OriginClass{
        constructor(...args: any[]) {
            super(...args);
        }
        static add(data: T, user_id: string, success?: Function, error?: Function) {
        }
        static getOne(id: IDBValidKey, success: (data: (T | undefined)) => void, error: (e: Error) => void) {
        }
        static getMany(range: IDBKeyRange, success: (data: T[]) => void, error: (e: Error) => void) {
        }
        static getOneFromIndex(index: keyof T, query: IDBValidKey, success: (data: (T | undefined)) => void, error: (e: Error) => void) {
        }
        static getManyFromIndex(index: keyof T, query: IDBKeyRange, success: (data: T[]) => void, error: (e: Error) => void) {
        }
        static getAllFromIndex(index: keyof T, success: (data: T[]) => void, error: (e: Error) => void) {
        }
        static getAll(success: (data: T[]) => void, error: (e: Error) => void) {
        }
        static update(data: T, user_id: string, success?: Function, error?: Function) {
        }
        static delete(id: IDBValidKey, user_id: string, success?: Function, error?: Function) {
        }
    }

}