import ErrorReport from "../controllers/ErrorReport";
import EventEmitter from "./EventEmmiter";

/**
 * Абстрактный класс для сущностей, содержит набор дефолтных методов
 * @class
 * @name Entity
 * @abstract
 * @category Classes
 */
export default class Entity extends EventEmitter{
    _new = false
    _change = false
    _modified = {}

    toString() {
        const res = JSON.stringify(this._modified)
        console.log(res)
        return res
        // try {
        //     return JSON.parse(JSON.stringify(this._modified))
        // } catch (err){
        //     console.error(err)
        //     ErrorReport.sendError(err).catch(console.error)
        //     return err.message
        // }
    }

    /**
     * return plain travel object
     * @returns {TravelType}
     */
    get object() {
        return {...this._modified}
    }

    /**
     * @method
     * @name Entity.save
     * @abstract
     * @throws Error
     */
    async save() {
        throw new Error('Method "save" should be implemented')
    }

}