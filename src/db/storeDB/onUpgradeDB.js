import constants from "../../static/constants";

/*** @type{UpgradeDBType[]} */
export const onUpgradeDB = [
    {
        version:21,
        storeNames: [constants.store.SECTION],
        transformCD: function(storeName, noModifiedItem){
            console.log(storeName, ' - ', noModifiedItem)
            return noModifiedItem
        }
    }
]