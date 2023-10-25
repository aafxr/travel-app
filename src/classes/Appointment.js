import Entity from "./Entity";

/**
 * Класс для редактирования встреч
 * @class
 * @name Appointment
 * @extends Entity
 *
 *
 * @param {AppointmentType} item
 * @constructor
 */
export default class Appointment extends Entity{
    /**@type{AppointmentType}*/
    static initValue = {
        id: () => '',
        date: () => new Date().toISOString(),
        time: () => new Date().toISOString().split('T').pop().match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)[0],
        title: () => '',
        description: () => '',
        primary_entity_id: () => '',
    }
    /**
     * @param {AppointmentType} item
     * @constructor
     */
    constructor(item) {
        super()
        if(!item){
            item = {}
            this._new = true
        }
        /***@type{AppointmentType} */
        this._modified = {}

        Object.keys(Appointment.initValue).forEach(key => this._modified[key] = Appointment.initValue[key]())
        this
            .setID(item.id)
            .setDate(item.date)
            .setTitle(item.title)
            .setDescription(item.description)
            .setPrimaryEntityID(item.primary_entity_id)

        this._change = this._new
    }

    /**
     * метод возвращает id
     * @get
     * @name Appointment.id
     * @returns {string}
     */
    get id(){
        return this._modified.id
    }

    /**
     * метод устанавливает id
     * @method
     * @name Appointment.setID
     * @param {string} id
     * @returns {Appointment}
     */
    setID(id) {
        if (typeof id === 'string' && id.length > 0) {
            this._modified.id = id
            this._change = true
        }
        return this
    }

    /**
     * метод возвращает date
     * @get
     * @name Appointment.date
     * @returns {string}
     */
    get date(){
        return this._modified.date
    }

    /**
     * метод устанавливает date
     * @method
     * @name Appointment.setDate
     * @param {Date | string} date дата, когда планируется встреча
     * @returns {Appointment}
     */
    setDate(date) {
        const d = new Date(date)
        if(date instanceof Date){
            this._modified.date = date.toISOString()
            this._change = true
        }
        else if (!Number.isNaN(d.getTime())) {
            this._modified.date = d.toISOString()
            this._change = true
        }
        return this
    }

    /**
     * метод возвращает time
     * @get
     * @name Appointment.time
     * @returns {string}
     */
    get time(){
        return this._modified.time
    }

    /**
     * метод устанавливает time
     * @method
     * @name Appointment.setTime
     * @param {Date | string} time время, когда планируется встреча (например: "18:20:00")
     * @returns {Appointment}
     */
    setTime(time) {
        const t = new Date(time)
        const result = t.toISOString().match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)
        if(result && result[0]) {
            this._modified.date = result[0]
            this._change = true
        }
        return this
    }
    /**
     * метод возвращает title
     * @get
     * @name Appointment.title
     * @returns {string}
     */
    get title(){
        return this._modified.title
    }

    /**
     * метод устанавливает title
     * @method
     * @name Appointment.setTitle
     * @param {string} title
     * @returns {Appointment}
     */
    setTitle(title) {
        if (typeof title === 'string' && title.length > 0) {
            this._modified.title = title
            this._change = true
        }
        return this
    }

    /**
     * метод возвращает description
     * @get
     * @name Appointment.description
     * @returns {string}
     */
    get description(){
        return this._modified.description
    }

    /**
     * метод устанавливает description
     * @method
     * @name Appointment.setDescription
     * @param {string} description
     * @returns {Appointment}
     */
    setDescription(description) {
        if (typeof description === 'string' && description.length > 0) {
            this._modified.description = description
            this._change = true
        }
        return this
    }

    /**
     * метод возвращает primary_entity_id
     * @get
     * @name Appointment.primary_entity_id
     * @returns {string}
     */
    get primary_entity_id(){
        return this._modified.primary_entity_id
    }

    /**
     * метод устанавливает primary_entity_id
     * @method
     * @name Appointment.setPrimaryEntityID
     * @param {string} primary_entity_id
     * @returns {Appointment}
     */
    setPrimaryEntityID(primary_entity_id) {
        if (typeof primary_entity_id === 'string' && primary_entity_id.length > 0) {
            this._modified.primary_entity_id = primary_entity_id
            this._change = true
        }
        return this
    }

    async save() {}
}