import ErrorReport from "../controllers/ErrorReport";
import LimitError from "../errors/LimitError";
import storeDB from "../classes/db/storeDB/storeDB";
import constants from "../static/constants";
import createAction from "../utils/createAction";

/**
 * Сервис добавляет CRUD операци для работы с бд
 * @name LimitService
 * @class
 * @category Services
  */
class LimitService{
    /**
     * Метод записывает данные в бд
     * @method
     * @name LimitService.create
     * @param {LimitType} limit новый лимит
     * @param {string} user_id id пользователя, создавшего новый лимит
     * @returns {Promise<LimitType | null>}
     */
    async create(limit, user_id){
        try {
            const action = createAction(constants.store.LIMIT, user_id, 'add', limit)

            await storeDB.addElement(constants.store.LIMIT, limit)
            await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
            return limit
        } catch (err){
            console.error(err)
            ErrorReport.sendError(new LimitError("create", err)).catch(console.error)
            return null
        }
    }

    /**
     * Метод считывает из бд лимит с переданным id
     * @method
     * @name LimitService.read
     * @param {string} id id лимита
     * @returns {Promise<LimitType | null>}
     */
    async read(id){
        try {
            return await storeDB.getOne(constants.store.LIMIT, id)
        } catch (err){
            console.error(err)
            ErrorReport.sendError(new LimitError("create", err)).catch(console.error)
            return null
        }
    }
    /**
     * Метод считывает из бд лимит с переданным primary_id (id путешествия)
     * @method
     * @name LimitService.readAllByPrimaryID
     * @param primary_id id путешествия
     * @returns {Promise<LimitType[]>}
     */
    async readAllByPrimaryID(primary_id){
        try {
            const limits = await storeDB.getAllFromIndex(constants.indexes.PRIMARY_ENTITY_ID, primary_id)
            return Array.isArray(limits) ? limits : []
        } catch (err){
            console.error(err)
            ErrorReport.sendError(new LimitError("readAllByPrimaryID", err)).catch(console.error)
            return []
        }
    }
    /**
     * Метод обновляет данные лимита в бд
     * @method
     * @name LimitService.update
     * @param {LimitType} limit id лимита
     * @param {string} user_id id пользователя, обновившего лимит
     * @returns {Promise<LimitType | null>}
     */
    async update(limit, user_id){
        try {
            const action = createAction(constants.store.LIMIT, user_id, 'update', limit)
            await storeDB.editElement(constants.store.LIMIT, limit)
            await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
            return limit
        } catch (err){
            console.error(err)
            ErrorReport.sendError(new LimitError("create", err)).catch(console.error)
            return null
        }
    }
    /**
     * Метод удаляет данные лимита из бд
     * @method
     * @name LimitService.delete
     * @param {LimitType} limit удаляемый лимита
     * @param {string} user_id id пользователя, обновившего лимит
     * @returns {Promise<LimitType | null>}
     */
    async delete(limit, user_id){
        try {
            const action = createAction(constants.store.LIMIT, user_id, 'remove', limit)
            await storeDB.removeElement(constants.store.LIMIT, limit.id)
            await storeDB.addElement(constants.store.EXPENSES_ACTIONS, action)
            return limit
        } catch (err){
            console.error(err)
            ErrorReport.sendError(new LimitError("create", err)).catch(console.error)
            return null
        }
    }
}


const limit_service = new LimitService()

export default limit_service