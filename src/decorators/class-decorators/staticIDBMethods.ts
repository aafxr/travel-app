export interface StaticIDBMethodsInterface<T>{
    add(data:T, user_id: string, success?: Function, error?: Function): void
    getOne(id:IDBValidKey, success?:(data:T | undefined) => void, error?: (e: Error) => void): void
    getMany(range:IDBKeyRange, success?:(data:T[]) => void, error?: (e: Error) => void): void
    getAll(success?:(data:T[]) => void, error?: (e: Error) => void):void
    getOneFromIndex(index: keyof T, query: IDBValidKey, success?:(data:T | undefined) => void, error?: (e: Error) => void): void
    getManyFromIndex(index: keyof T, query: IDBKeyRange, success?:(data:T[]) => void, error?: (e: Error) => void): void
    getAllFromIndex(index: keyof T, count?:number,  success?:(data:T[]) => void, error?: (e: Error) => void): void
    update(data:T, user_id: string, success?: Function, error?: Function): void
    delete(data:T, user_id: string, success?: Function, error?: Function): void
}









// function staticIDBMethods<T extends {new(...args: any[]): WithDTOMethod}>(OriginClass: T, storeName: StoreName, createAction = false): T & StaticIDBMethodsInterface<WithDTOMethod> {
//     return class Extended extends OriginClass{
//
//         constructor(...args: any[]) {
//             super(...args);
//         }
//
//
//         static getOne<T extends WithDTOMethod>(id: IDBValidKey, success?: (data: (T | undefined)) => void, error?: (e: Error) => void) {
//             storeDB.getOne(storeName, id)
//                 .then(item => success && success(item))
//                 .catch((e) => error && error(e))
//         }
//
//
//         static getMany<T extends WithDTOMethod>(range: IDBKeyRange, success?: (data: T[]) => void, error?: (e: Error) => void) {
//             storeDB.getMany(storeName, range)
//                 .then(items => success && success(items))
//                 .catch((e) => error && error(e))
//         }
//
//
//         static getOneFromIndex<T extends WithDTOMethod>(index: keyof T & string, query: IDBValidKey, success?: (data: (T | undefined)) => void, error?: (e: Error) => void) {
//             storeDB.getOneFromIndex(storeName,index, query)
//                 .then(item => success && success(item))
//                 .catch((e) => error && error(e))
//         }
//
//
//         static getManyFromIndex<T extends WithDTOMethod>(index: keyof T & string, query: IDBKeyRange, success?: (data: T[]) => void, error?: (e: Error) => void) {
//             storeDB.getManyFromIndex(storeName,index, query)
//                 .then(items => success && success(items))
//                 .catch((e) => error && error(e))
//         }
//
//
//         static getAllFromIndex<T extends WithDTOMethod>(index: keyof T & string, count?: number,  success?: (data: T[]) => void, error?: (e: Error) => void) {
//             storeDB.getAllFromIndex(storeName,index, count)
//                 .then(items => success && success(items))
//                 .catch((e) => error && error(e))
//         }
//
//
//         static getAll<T extends WithDTOMethod>(success?: (data: T[]) => void, error?: (e: Error) => void) {
//             storeDB.getAll(storeName)
//                 .then(items => success && success(items))
//                 .catch((e) => error && error(e))
//         }
//
//
//         static add<T extends WithDTOMethod>(data: T, user_id: string, success?: Function, error?: Function) {
//             storeDB.addElement(storeName, data.dto())
//                 .then(() => {
//                     if(createAction && 'user_id' in data){
//                         const action = new Action(data,user_id,storeName, ActionName.ADD)
//                         storeDB.addElement(StoreName.ACTION, action)
//                             .catch(defaultHandleError)
//                     }
//                     success && success()
//                 })
//                 .catch((e) => error && error(e))
//         }
//
//
//         static update<T extends WithDTOMethod>(data: T, user_id: string, success?: Function, error?: Function) {
//             storeDB.editElement(storeName, data.dto())
//                 .then(() => {
//                     if(createAction && 'user_id' in data){
//                         const action = new Action(data,user_id,storeName, ActionName.UPDATE)
//                         storeDB.addElement(StoreName.ACTION, action)
//                             .catch(defaultHandleError)
//                     }
//                     success && success()
//                 })
//                 .catch((e) => error && error(e))
//         }
//
//
//         static delete<T extends WithDTOMethod>(data: T, user_id: string, success?: Function, error?: Function) {
//             if(!('id' in data)) return
//
//             storeDB.removeElement(storeName, data.id as IDBValidKey)
//                 .then(() => {
//                     if(createAction && 'user_id' in data){
//                         const action = new Action(data,user_id,storeName, ActionName.DELETE)
//                         storeDB.addElement(StoreName.ACTION, action)
//                             .catch(defaultHandleError)
//                     }
//                     success && success()
//                 })
//                 .catch((e) => error && error(e))
//         }
//     }
//
// }