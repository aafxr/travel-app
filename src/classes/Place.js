/**
 * @typedef {PlaceType} PlaceOptionsType
 * @property {Travel} travel
 */
import Entity from "./Entity";

/**
 * @class
 * @name Place
 * @extends Entity
 *
 * @constructor
 * @param {PlaceOptionsType} options
 * @category Classes
 */
export default class Place extends Entity {
    /**@type{PlaceType}*/
    _defaultPlace = {
        name: () => '',
        photos: () => [],
        location: () => ({lat: 0, lng: 0}),
        formatted_address: () => '',
    }
    /**@type{PlaceType}*/
    _modified

    /**@type{Travel}*/
    _travel

    _new = false

    /**
     * @param {PlaceOptionsType} options
     */
    constructor(options) {
        super()
        if (!options) {
            options = {}
            this._new = true
        }

        Object.keys(this._defaultPlace).forEach(key => this._modified[key] = this._defaultPlace[key]())

        this
            .setName(options.name)
            .setLocation(options.location)
            .setPhotos(options.photos)
            .setFormattedAddress(options.formatted_address)

        this._travel = options.travel
        this._change = this._new

    }


    /**
     * геттер возвращает свойство name
     * @get
     * @name Place.name
     * @returns {string}
     */
    get name() {
        return this._modified.name
    }

    /**
     * метод устанавливет свойство name
     * @method
     * @name Place.setName
     * @param {string} value
     * @returns {Place}
     */
    setName(value) {
        if (typeof value === 'string' && value.length) {
            this._modified.name = value
        }
        return this
    }

    /**
     * геттер возвращает свойство location
     * @get
     * @name Place.location
     * @returns {LocationType}
     */
    get location() {
        return this._modified.coords
    }

    /**
     * метод устанавливет свойство coords
     * @method
     * @name Place.setLocation
     * @param {LocationType} value
     * @returns {Place}
     */
    setLocation(value) {
        if (value && value.lat && value.lng) {
            this._modified.location = value
        }
        return this
    }

    /**
     * геттер возвращает свойство photos
     * @get
     * @name Place.photos
     * @returns {string[]}
     */
    get photos() {
        return this._modified.photos
    }

    /**
     * метод устанавливет свойство photos
     * @method
     * @name Place.setPhotos
     * @param {string[]} value массив ссылок на изобрадения
     * @returns {Place}
     */
    setPhotos(value) {
        if (Array.isArray(value)) {
            this._modified.photos = value
        }
        return this
    }

    /**
     * геттер возвращает свойство formatted_address
     * @get
     * @name Place.formatted_address
     * @returns {string}
     */
    get formatted_address() {
        return this._modified.formatted_address
    }

    /**
     * метод устанавливет свойство formatted_address
     * @method
     * @name Place.setFormattedAddress
     * @param {string} value массив ссылок на изобрадения
     * @returns {Place}
     */
    setFormattedAddress(value) {
        if (typeof value === 'string' && value.length) {
            this._modified.formatted_address = value
        }
        return this
    }
}