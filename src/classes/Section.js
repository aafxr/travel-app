import Entity from "./Entity";

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
export default class Section extends Entity{
    /**@type{SectionType}*/
    static initValue= {
        id: () => '',
        title: () => '',
        color: () => '',
        hidden: () => 0,
    }

    /**@type{SectionType}*/
    _modified = {}

    /**
     * @constructor
     * @param {SectionType} item
     */
    constructor(item) {
        super();
        if(!item){
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
    get id(){
        return this._modified.id
    }

    /**
     * метод устанавливает id секции
     * @method
     * @name Section.setID
     * @param {string} id id секции
     * @returns {Section}
     */
    setID(id){
        if (typeof id === 'string' && id.length > 0) {
            this._modified.id = id
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
    get title(){
        return this._modified.title
    }

    /**
     * метод устанавливает title секции
     * @method
     * @name Section.setTitle
     * @param {string} title title секции
     * @returns {Section}
     */
    setTitle(title){
        if (typeof title === 'string' && title.length > 0) {
            this._modified.title = title
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
    get color(){
        return this._modified.color
    }

    /**
     * метод устанавливает color секции
     * @method
     * @name Section.setColor
     * @param {string} color color секции
     * @returns {Section}
     */
    setColor(color){
        if (typeof color === 'string' && color.length > 0) {
            this._modified.color = color
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
    get hidden(){
        return this._modified.hidden
    }

    /**
     * метод устанавливает color секции
     * @method
     * @name Section.setHidden
     * @param {DBFlagType} flag color секции
     * @returns {Section}
     */
    setHidden(flag){
        if (typeof flag === 'number' && (flag === 1 || flag === 0)) {
            this._modified.hidden = flag
            this._change = true
        }
        return this
    }

    async save() {}
}