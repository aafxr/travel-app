import limit_service from "../services/limit_service";
import Entity from "./Entity";

/**
 * Класс для работы с лимитами
 * @class
 * @name Limit
 * @extends Entity
 *
 *
 * @param {LimitType} item запись о существующем лимите в бд (если есть)
 * @constructor
 */
export default class Limit extends Entity{
    /**@type{LimitType} */
    static initValue = {
        id: () => '',
        value: () => 0,
        personal: () => 0,
        section_id: () => '',
    }

    /**
     * @param {LimitType} item запись о существующем лимите в бд (если есть)
     * @constructor
     */
    constructor(item) {
        super()
        if (!item) {
            item = {}
            this._new = true
        }

        /***@type {LimitType} */
        this._modified = {}
        Object.keys(Limit.initValue).forEach(key => this._modified[key] = Limit.initValue[key]())
        this
            .setID(item.id)
            .setValue(item.value)
            .setPersonal(item.personal)
            .setSectionID(item.section_id)

        this.change = this._new
    }

    /**
     * метод возвращает id
     * @get
     * @name Limit.id
     * @returns {string}
     */
    get id() {
        return this._modified.id
    }

    /**
     * метод устанавливает id
     * @method
     * @name Limit.setID
     * @param {string} id
     * @returns {Limit}
     */
    setID(id) {
        if (typeof id === 'string' && id.length > 0) {
            this._modified.id = id
            this.change = true
        }
        return this
    }

    /**
     * метод возвращает value
     * @get
     * @name Limit.value
     * @returns {number}
     */
    get value() {
        return this._modified.value
    }

    /**
     * метод устанавливает value
     * @method
     * @name Limit.setValue
     * @param {number} value
     * @returns {Limit}
     */
    setValue(value) {
        if (typeof value === 'number' && value >= 0) {
            this._modified.value = value
            this.change = true
        }
        return this
    }

    /**
     * метод возвращает personal
     * @get
     * @name Limit.personal
     * @returns {DBFlagType}
     */
    get personal() {
        return this._modified.personal
    }

    /**
     * метод устанавливает флаг personal
     * @method
     * @name Limit.setPersonal
     * @param {DBFlagType} flag
     * @returns {Limit}
     */
    setPersonal(flag) {
        if (typeof flag === 'number' && (flag === 1 || flag === 0)) {
            this._modified.personal = flag
            this.change = true
        }
        return this
    }

    /**
     * метод возвращает section_id
     * @get
     * @name Limit.section_id
     * @returns {string}
     */
    get section_id() {
        return this._modified.section_id
    }

    /**
     * метод устанавливает section_id
     * @method
     * @name Limit.setSectionID
     * @param {string} id
     * @returns {Limit}
     */
    setSectionID(id) {
        if (typeof id === 'string' && id.length > 0) {
            this._modified.section_id = id
            this.change = true
        }
        return this
    }

    /**
     * метод возвращает флаг (модифицирован или нет) лимита
     * @get
     * @name Limit.changed
     * @returns {boolean}
     */
    get changed() {
        return this.change
    }

    /**
     * метод устанавливает id пользователя, для которого плянируется данный лимит,
     * в дальнейшем при сохранении / изменении в бд записи об этом лимите, будет использоваться данный лимит
     * @method
     * @name Limit.setUser
     * @param {string} user_id id пользователя, для которого будет использоваться данный лимит
     * @returns {Limit}
     */
    setUser(user_id) {
        if (typeof user_id === 'string' && user_id.length > 0) {
            this.user_id = user_id
        }
        return this
    }

    /**
     * метод реализует создание / обновление заприси о лимите в бд
     * @method
     * @name Limit.save
     * @param user_id id пользователя, для которого будет использоваться данный лимит
     * @returns {Promise<Limit>}
     */
    async save(user_id) {
        const userOK = typeof user_id === 'string' && user_id.length > 0

        if (this.change && (userOK || this.user_id)) {
            this._new
                ? await limit_service.create(this._modified, userOK ? user_id : this.user_id)
                : await limit_service.update(this._modified, userOK ? user_id : this.user_id)
        }
        return this
    }

    /**
     * метод реализует удаление заприси о лимите из бд
     * @method
     * @name Limit.delete
     * @param user_id id пользователя, для которого будет использоваться данный лимит
     * @returns {Promise<Limit>}
     */
    async delete(user_id) {
        const userOK = typeof user_id === 'string' && user_id.length > 0

        if (userOK || this.user_id) {
            await limit_service.delete(this._modified, userOK ? user_id : this.user_id)
        }
        return this
    }
}