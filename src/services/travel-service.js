import ErrorReport from "../controllers/ErrorReport";
import TravelError from "../errors/TravelError";
import createAction from "../utils/createAction";
import storeDB from "../classes/db/storeDB/storeDB";
import constants from "../static/constants";
import removeTravel from "../utils/removeTravel";

/**
 * Сервис добавляет CRUD операци для работы с TravelStoreType бд
 * @name TravelService
 * @class
 * @category Services
 */
export class TravelService {
    /**
     * Метод создания нового путешествия
     * @method
     * @name TravelService.create
     * @param {TravelStoreType} travel новое путешествие
     * @param {string} user_id id пользователя, создавшего путешествие
     * @returns {Promise<TravelStoreType | null>}
     */
    async create(travel, user_id){
        try {
            const action = createAction(constants.store.TRAVEL, user_id , "add", travel)
            await storeDB.addElement(constants.store.TRAVEL, travel)
            await storeDB.addElement(constants.store.TRAVEL_ACTIONS, action)
            return travel
        }catch (err){
            console.error(err)
            ErrorReport.sendError(new TravelError("create", err)).catch(console.error)
            return null
        }
    }
    /**
     * Метод возвращает найденную в бд запись (по id) о путешествии
     * @method
     * @name TravelService.read
     * @param {string} id id путешествия
     * @returns {Promise<TravelStoreType|null>}
     */
    async read(id){
        try {
            const travel = await storeDB.getOne(constants.store.TRAVEL, id)
            return travel ? travel : null
        }catch (err){
            console.error(err)
            ErrorReport.sendError(new TravelError("read", err)).catch(console.error)
            return null
        }
    }
    /**
     * Метод возвращает записи о всех путешествии в бд
     * @method
     * @name TravelService.readAll
     * @returns {Promise<TravelStoreType[]>}
     */
    async readAll(){
        try {
            const travel = await storeDB.getAll(constants.store.TRAVEL)
            return travel ? travel : []
        }catch (err){
            console.error(err)
            ErrorReport.sendError(new TravelError("read", err)).catch(console.error)
            return []
        }
    }
    /**
     * Метод обнлвляет данные о путешествии в бд
     * @method
     * @name TravelService.update
     * @param {TravelStoreType} travel
     * @param {string} user_id id пользователя, создавшего путешествие
     * @returns {Promise<TravelStoreType | null>}
     */
    async update(travel, user_id){
        try {
            const action = createAction(constants.store.TRAVEL, user_id , "update", travel)
            await storeDB.editElement(constants.store.TRAVEL, travel)
            await storeDB.addElement(constants.store.TRAVEL_ACTIONS, action)
            return travel
        }catch (err){
            console.error(err)
            ErrorReport.sendError(new TravelError("update", err)).catch(console.error)
            return null
        }
    }
    /**
     * Метод удаляет путешествие
     * @method
     * @name TravelService.delete
     * @param {TravelStoreType} travel удаляемое путешествие
     * @param {string} user_id id пользователя, который удаляет путешествия
     * @returns {Promise<TravelStoreType | null>}
     */
    async delete(travel, user_id){
        try {
            const action = createAction(constants.store.TRAVEL, user_id , "remove", travel)
            await removeTravel(travel, user_id)
            await storeDB.addElement(constants.store.TRAVEL_ACTIONS, action)
        }catch (err){
            console.error(err)
            ErrorReport.sendError(new TravelError("delete", err)).catch(console.error)
            return null
        }
    }
}

const travel_service = new TravelService()

export default travel_service