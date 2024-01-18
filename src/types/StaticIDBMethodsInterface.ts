
export interface StaticIDBMethodsInterface<T>{
    new(): T
    add(data:T, user_id: string, success?: Function, error?: Function): void
    getOne(id:IDBValidKey, success:(data:T | undefined) => void, error: (e: Error) => void): void
    getMany(range:IDBKeyRange, success:(data:T[]) => void, error: (e: Error) => void): void
    getOneFromIndex(index: keyof T, query: IDBValidKey, success:(data:T | undefined) => void, error: (e: Error) => void): void
    getManyFromIndex(index: keyof T, query: IDBKeyRange, success:(data:T[]) => void, error: (e: Error) => void): void
    update(data:T, user_id: string, success?: Function, error?: Function): void
    delete(id:IDBValidKey, user_id: string, success?: Function, error?: Function): void
}

/* class decorator */
export function staticImplements<T>() {
    return <U extends T>(constructor: U) => {};
}