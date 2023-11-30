import constants from "../../static/constants";
import defaultPlace from "../../utils/default-values/defaultPlace";

/*** @type{UpgradeDBType[]} */
export const onUpgradeDB = [
    {
        version:21,
        storeNames: [constants.store.SECTION],
        transformCD: function(storeName, noModifiedItem){
            console.log(storeName, ' - ', noModifiedItem)
            return noModifiedItem
        }
    },
    {
        version: 22,
        storeNames: [constants.store.TRAVEL],
        transformCD: (storeName, noModifiedItem) => {
            if(storeName === constants.store.TRAVEL){
                /**@type{TravelType}*/
                const travel= noModifiedItem
                travel.places.map((p, idx) => {
                    const place = defaultPlace(travel.id)

                })
            }

            return noModifiedItem
        }
    }
]