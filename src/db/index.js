import {openDB} from 'idb'


function init({dbname, version, stores}) {
    return openDB(dbname, version, {
        upgrade(db) {
            stores.forEach(function (storeInfo) {
                if (!db.objectStoreNames.contains(storeInfo.name)) {
                    const store = db.createObjectStore(storeInfo.name, {keyPath: storeInfo.key});
                    storeInfo.indexes.forEach(function (indexName) {
                        store.createIndex(indexName, indexName);
                    })
                }
            })
        },
    })
}


export class Database {
    constructor({dbname, version, stores}, {onReady, onError}) {
        this.dbname = dbname;
        this.version = version;
        this.stores = stores;
        init({dbname, version, stores})
            .then((db) => {
                if (onReady) {
                    onReady(this)
                }
            })
            .catch((err) => {
                onError(err)
            })
    }

    getStoreInfo(store) {
        return this.stores.find(item => item.name === store);
    }

    isIndexProp(indexes, key) {
        return indexes.includes(key);
    }


    getElement(store, query) {
        const storeInfo = this.getStoreInfo(store)
        if (storeInfo) {
            return openDB(this.dbname, this.version)
                .then(db => {
                    return db.get(store, query)
                })
        }
        return Promise.reject(new Error(`[DB/${this.dbname}]: Store '${store}' not exist`))
    }

    getFromIndex(store, indexName, query) {
        const storeInfo = this.getStoreInfo(store)
        if (storeInfo) {
            if (this.isIndexProp(store, indexName)) {
                return openDB(this.dbname, this.version)
                    .then(db => {
                        return db.getFromIndex(store, indexName, query)
                    })
            }
            return Promise.reject(new Error(`[DB/${this.dbname}]: Index ${indexName} not exists in ${store}`))
        }
        return Promise.reject(new Error(`[DB/${this.dbname}]: Store '${store}' not exist`))
    }

    addElement(store, payload) {
        const storeInfo = this.getStoreInfo(store)
        if (storeInfo) {
            return openDB(this.dbname, this.version)
                .then(db => {
                    return db.add(store, payload)
                })
        }
        return Promise.reject(new Error(`[DB/${this.dbname}]: Store '${store}' not exist`))
    }

    editElement(store, payload) {
        const storeInfo = this.getStoreInfo(store)
        if (storeInfo) {
            return openDB(this.dbname, this.version)
                .then(db => {
                    return db.put(store, payload)
                })
        }
        return Promise.reject(new Error(`[DB/${this.dbname}]: Store '${store}' not exist`))
    }

    removeElement(store, key) {
        const storeInfo = this.getStoreInfo(store)
        if (storeInfo) {
            return openDB(this.dbname, this.version)
                .then(db => {
                    return db.delete(store, key)
                })
        }
        return Promise.reject(new Error(`[DB/${this.dbname}]: Store '${store}' not exist`))
    }

}
