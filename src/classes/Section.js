import Entity from "./Entity";
import RestAPI from "./RestAPI";
import storeDB from "../db/storeDB/storeDB";
import constants from "../static/constants";

/**
 * класс для работы с сущностью Section
 * @class
 * @name Section
 * @extends Entity
 * @category Classes
 *
 *
 * @param {SectionType} item
 * @constructor
 */
export default class Section extends Entity {
    /**@type{SectionType}*/
    static initValue = {
        id: () => '',
        title: () => '',
        color: () => '',
        hidden: () => 0,
    }

    /**@type{SectionType}*/
    _modified = {}



    /**
     * метод возвращает дефолтные секции из бд или делает запрос к api
     * @static
     * @name Section.defaultSections
     * @returns {Promise<SectionType[]>}
     */
    static async defaultSections() {
        let defaultSections = await storeDB.getAll(constants.store.SECTION)
        if(defaultSections.length === 0) {
            let defaultSections = await RestAPI.fetchSections()
            defaultSections = defaultSections.map(s => new Section(s).object)
            const promises = defaultSections.map(s => storeDB.editElement(constants.store.SECTION, s))
            await Promise.all(promises)
        }
        return defaultSections
    }

    /**
     * @constructor
     * @param {SectionType} item
     */
    constructor(item) {
        super();
        if (!item) {
            item = {}
            this._new = true
        }

        Object.keys(Section.initValue).forEach(key => this._modified[key] = Section.initValue[key]())
        this
            .setID(item.id)
            .setTitle(item.title)
            .setColor(item.color)
            .setHidden(item.hidden)

        this._change = this._new
    }

    /**
     * геттер, возвращает id
     * @get
     * @name Section.id
     * @returns {string}
     */
    get id() {
        return this._modified.id
    }

    /**
     * метод устанавливает id секции
     * @method
     * @name Section.setID
     * @param {string} id id секции
     * @returns {Section}
     */
    setID(id) {
        if (typeof id === 'string' && id.length > 0) {
            this._modified.id = id
            this.emit('id', [id])
            this._change = true
        }
        return this
    }

    /**
     * геттер, возвращает title
     * @get
     * @name Section.title
     * @returns {string}
     */
    get title() {
        return this._modified.title
    }

    /**
     * метод устанавливает title секции
     * @method
     * @name Section.setTitle
     * @param {string} title title секции
     * @returns {Section}
     */
    setTitle(title) {
        if (typeof title === 'string' && title.length > 0) {
            this._modified.title = title
            this.emit('title', [title])
            this._change = true
        }
        return this
    }

    /**
     * геттер, возвращает color
     * @get
     * @name Section.color
     * @returns {string}
     */
    get color() {
        return this._modified.color
    }

    /**
     * метод устанавливает color секции
     * @method
     * @name Section.setColor
     * @param {string} color color секции
     * @returns {Section}
     */
    setColor(color) {
        if (typeof color === 'string' && color.length > 0) {
            this._modified.color = color
            this.emit('color', [color])
            this._change = true
        }
        return this
    }

    /**
     * геттер, возвращает hidden
     * @get
     * @name Section.hidden
     * @returns {DBFlagType}
     */
    get hidden() {
        return this._modified.hidden
    }

    /**
     * метод устанавливает color секции
     * @method
     * @name Section.setHidden
     * @param {DBFlagType} flag color секции
     * @returns {Section}
     */
    setHidden(flag) {
        if (typeof flag === 'number' && (flag === 1 || flag === 0)) {
            this._modified.hidden = flag
            this.emit('hidden', [flag])
            this._change = true
        }
        return this
    }

    async save() {
    }
}