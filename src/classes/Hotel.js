import Entity from "./Entity";

/**
 * класс для работы с сущностью Hotel
 * @class
 * @name Hotel
 * @extends Entity
 * @category Classes
 *
 *
 * @param {HotelType} item
 * @constructor
 */
export default class Hotel extends Entity{
    /**@type{HotelType}*/
    static initValue = {
        id: () => '',
        title: () => '',
        check_in: () => new Date().toISOString(),
        check_out: () => new Date().toISOString(),
        location: () => ({lat: '0', lng: '0'}),
    }

    /**@type{HotelType}*/
    _modified= {}

    /**
     * @param {HotelType} item
     * @constructor
     */
    constructor(item) {
        super();
        if(!item){
            item = {}
            this._new = true
        }

        Object.keys(Hotel.initValue).forEach(key => this._modified[key] = Hotel.initValue[key]())
        this
            .setID(item.id)
            .setTitle(item.title)
            .setCheckIn(item.check_in)
            .setCheckOut(item.check_out)
            .setLocation(item.location)

        this._change = this._new
    }

    /**
     * геттер, возвращает id
     * @get
     * @name Hotel.id
     * @returns {string}
     */
    get id(){
        return this._modified.id
    }

    /**
     * метод устанавливает id отеля
     * @method
     * @name Hotel.setID
     * @param {string} id id отеля
     * @returns {Hotel}
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
     * @name Hotel.title
     * @returns {string}
     */
    get title(){
        return this._modified.title
    }

    /**
     * метод устанавливает title отеля
     * @method
     * @name Hotel.setTitle
     * @param {string} title title отеля
     * @returns {Hotel}
     */
    setTitle(title){
        if (typeof title === 'string' && title.length > 0) {
            this._modified.title = title
            this._change = true
        }
        return this
    }

    /**
     * геттер, возвращает check_in
     * @get
     * @name Hotel.check_in
     * @returns {string}
     */
    get check_in(){
        return this._modified.check_in
    }

    /**
     * метод устанавливает check_in отеля
     * @method
     * @name Hotel.setCheckIn
     * @param {Date | string} check_in check_in отеля
     * @returns {Hotel}
     */
    setCheckIn(check_in){
        const date = check_in instanceof Date ? check_in : new Date(check_in)
        if (!Number.isNaN(date.getTime())) {
            this._modified.check_in = date.toISOString()
            this._change = true
        }
        return this
    }

    /**
     * геттер, возвращает check_out
     * @get
     * @name Hotel.check_out
     * @returns {string}
     */
    get check_out(){
        return this._modified.check_out
    }

    /**
     * метод устанавливает check_out отеля
     * @method
     * @name Hotel.setCheckOut
     * @param {Date | string} check_out check_out отеля
     * @returns {Hotel}
     */
    setCheckOut(check_out){
        const date = check_out instanceof Date ? check_out : new Date(check_out)
        if (!Number.isNaN(date.getTime())) {
            this._modified.check_out = date.toISOString()
            this._change = true
        }
        return this
    }

    /**
     * геттер, возвращает location
     * @get
     * @name Hotel.location
     * @returns {LocationType}
     */
    get location(){
        return this._modified.location
    }

    /**
     * метод устанавливает location отеля
     * @method
     * @name Hotel.setLocation
     * @param {CoordinatesType} location check_out отеля
     * @returns {Hotel}
     */
    setLocation(location){
        if (Array.isArray(location) ) {
            this._modified.location = location
            this._change = true
        }
        return this
    }

    async save() {}
}