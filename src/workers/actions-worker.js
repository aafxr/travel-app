import expensesDB from "../db/expensesDB/expensesDB";
import constants from "../static/constants";
import aFetch from "../axios";
import travelDB from "../db/travelDB/travelDB";

setInterval(async () => {
    try {
        const actions = await expensesDB.getManyFromIndex(constants.store.EXPENSES_ACTIONS, constants.indexes.SYNCED, 0)
        if (actions) {
            const response = await aFetch.post('/actions/add/', actions)
            console.log(response.data)
        }
    } catch (err) {
        console.error(err)
    }
}, 4000)


setInterval(async () => {
    try {
        const actions = await travelDB.getManyFromIndex(constants.store.TRAVEL_ACTIONS, constants.indexes.SYNCED, 0)
        if (actions) {
            const response = await aFetch.post('/travel/add/', actions)
            console.log(response.data)
        }
    } catch (err) {
        console.error(err)
    }

}, 8000)