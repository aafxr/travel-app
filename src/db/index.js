import {openDB} from 'idb'
import dbSchema from './dbSchema'

const version = 1

export function init(){
    dbSchema.forEach(function(dbObj){
        openDB(dbObj.dbName, version,{
            upgrade(db){
                dbObj.stores.forEach(function(objectStore){
                    if (!db.objectStoreNames.contains(objectStore.name)) { 
                        const store = db.createObjectStore(objectStore.name, {keyPath: objectStore.key});
                        objectStore.indexes.forEach(function(indexName){
                            store.createIndex(indexName,indexName)
                        })
                    }
                })
            }
        })

    })

}




 export function addToStore(dbName, storeName, data, dataKey){
    return openDB(dbName)
        .then(db => 
            db.put(storeName, data, dataKey)
        )
 }