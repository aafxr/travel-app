import {Travel} from "../StoreEntities";

export class Compare{
    static objects<T extends {[key:string]: any}>(old: T, newObj: T, includeKeys: Array<keyof T> = [], excludeKeys: Array<keyof T> = []): Partial<T>{
        const result: Partial<T> = {}

        Object.keys(newObj).forEach(k => {
            if(excludeKeys.includes(k)) return
            if(old[k] !== newObj[k]) result[k as keyof T] = newObj[k]
        })

        for (const k of includeKeys) {
            result[k] = newObj[k]
        }

        return result
    }


    static  objectArrays(arr1: Array<object>, arr2:Array<object>){
        if(arr1.length !== arr2.length) return false

        let same = true

        arr1.forEach((item, index) => {
            if(!same) return
            const r = Compare.objects(item, arr2[index])
            if(Object.keys(r).length) same = false
        })

        return same
    }


    static travels(old: Travel, newT: Travel, includeKeys: Array<keyof Travel> = [], excludeKeys: Array<keyof Travel> = []){
        const result = Compare.objects(old, newT, includeKeys, excludeKeys)

        for (const k in result){
            const key = k as keyof Travel
            if(Array.isArray(result[key])){
                if(Compare.objectArrays(old[key] as Array<object>, newT[key] as Array<object>)){
                    // @ts-ignore
                    result[key] = newT[key]
                }
            }
            
            if(newT[key] instanceof Date){
                if((old[key] as Date).getTime() !== (newT[key] as Date).getTime())
                    { // @ts-ignore
                        result[key] = newT[key]
                    }
            }

            if(typeof result[key] === 'object'){
                // @ts-ignore
                result[key] = Compare.objects(old[key] as object, newT[key] as object)
                if(!Object.keys(result[key] as object).length) delete result[key]
            }
        }
        return result
    }
}