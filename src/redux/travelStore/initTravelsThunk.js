import {createAsyncThunk} from '@reduxjs/toolkit'
import constants from "../../static/constants";
import storeDB from "../../db/storeDB/storeDB";
import aFetch from "../../axios";
import checkTravelFields from "./checkTravelFields";
import {defaultTravel} from "./travelSlice";


/**
 * redux action который загружает в глобальное хранилище существующие маршруты
 */
export const initTravelsThunk = createAsyncThunk(
    'initTravelsThunk',
    async (_, thunkAPI) => {
        try {
            /**response - результат запроса на получение списока маршрутов от api */
            const response = await aFetch.get('/travel/getList/').catch((err) => {
                console.error(err)
                return
            })
            let travels
            if(response) {
                travels = response.data.ok ? response.data.data : []
                travels = checkTravelFields(travels)
                await Promise.all(travels.map(t => storeDB.editElement(constants.store.TRAVEL, t)))
            }

            /** если не удалось загрузить список маршрутов через api используем маршруты, сохраненные в локальной базе */
            // if (!travels || !travels.length) {
            //     travels = await storeDB.getAll(constants.store.TRAVEL)
            //     travels =  checkTravelFields(travels)
            // }
            travels = await storeDB.getAll(constants.store.TRAVEL)
            travels =  checkTravelFields(travels)
            if(Array.isArray(travels)) travels.forEach(checkTravelKeys)
            return {
                travels
            }
        } catch (err) {
            console.error(err)
            thunkAPI.abort()
        }

    }
)

function checkTravelKeys(travel){
    Object.keys(defaultTravel).forEach(key => {
        if(!travel[key]) travel[key] = defaultTravel[key]()
    })
}