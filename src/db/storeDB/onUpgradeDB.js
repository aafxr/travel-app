import constants from "../../static/constants";
import defaultPlace from "../../utils/default-values/defaultPlace";

/*** @type{UpgradeDBType[]} */
export const onUpgradeDB = [
    {
        version: 21,
        storeNames: [constants.store.SECTION],
        transformCD: function (storeName, noModifiedItem) {
            console.log(storeName, ' - ', noModifiedItem)
            return noModifiedItem
        }
    },
    {
        version: 22,
        storeNames: [constants.store.TRAVEL],
        transformCD: (storeName, noModifiedItem) => {
            if (storeName === constants.store.TRAVEL) {
                /**@type{TravelType}*/
                const travel = noModifiedItem
                travel.places = travel.places.map((p, idx) => {
                    const place = defaultPlace(travel.id)
                    Object.keys(place).forEach(key => {
                        if (!p[key])
                            p[key] = place[key]
                    })
                    return p
                })
                return travel
            }
            return noModifiedItem
        }
    },
    // {
    //     version: 25,
    //     storeNames: [constants.store.TRAVEL],
    //     transformCD: (storeName, noModifiedItem) => {
    //         if (storeName === constants.store.TRAVEL) {
    //             /**@type{TravelType}*/
    //             const travel = noModifiedItem
    //             travel.places.map((p, idx) => {
    //                 if (p.date_start) p.time_start = p.date_start
    //                 if (p.date_end) p.time_end = p.date_end
    //                 delete p.date_start
    //                 delete p.date_end
    //
    //                 return p
    //             })
    //             console.log(travel)
    //             return travel
    //         }
    //         return noModifiedItem
    //     }
    // }
].sort((a,b) => a.version - b.version)