import Entity from "./Entity";
import travel_service from "../services/travel-service";
import {DEFAULT_TRAVEL_DETAILS_FILTER, defaultMovementTags, ENTITY, MS_IN_DAY} from "../static/constants";
import RouteBuilder from "./RouteBuilder";
import defaultTravelDetailsFilter from "../utils/default-values/defaultTravelDetailsFilter";
import createId from "../utils/createId";

const defaultMovementTypes = [{id: defaultMovementTags[0].id, title: defaultMovementTags[0].title}]

/**
 * Базовый класс для редактирования и сохранения в бд сущности Travel
 * @class
 * @name BaseTravel
 * @extends Entity
 *
 *
 * @param {TravelType} item
 * @constructor
 */
export default class BaseTravel extends Entity {
    /**@type{TravelStoreType} */
    static initValue = {
        id: () => '',
        code: () => '',
        title: () => '',
        direction: () => '',
        description: () => '',
        owner_id: () => '',
        created_at: () => new Date().toISOString(),
        updated_at: () => new Date().toISOString(),
        appointments: () => [],
        members: () => [],
        hotels: () => [],
        movementTypes: () => defaultMovementTypes,
        waypoints: () => [],
        places: () => [],
        adults_count: () => 1,
        childs_count: () => 0,
        date_start: () => new Date().toISOString(),
        date_end: () => new Date().toISOString(),
        isPublic: () => 0,
        photo: () => '',
        isFromPoint: () => 0,
    }
    /***@type{TravelType} */
    _modified = {}

    /**@type{RouteBuilder}*/
    routeBuilder

    /**@type{TravelDetailsFilterType}*/
    _travelDetailsFilter

    _isCurtainOpen = true

    /**
     * @param {TravelStoreType} item
     * @param {string} travelCode
     * @constructor
     */
    constructor(item, travelCode) {
        super()
        if (!item) {
            item = {}
            this._new = true
        }

        Object
            .keys(BaseTravel.initValue)
            .forEach(key => this._modified[key] = BaseTravel.initValue[key]())

        if (travelCode)
            this._modified.id = travelCode

        this.routeBuilder = new RouteBuilder({
            travel: this,
            places: this._modified.places,
            appointments: this._modified.appointments,
            hotels: this._modified.hotels,
            waypoints: this._modified.waypoints
        })

        // this._checkTravelFields(item)
        this._modified = {
            ...this._modified,
            ...item,
            appointments: item.appointments ? item.appointments.map(a => {
                a.date = new Date(a.date)
                return a
            }) : [],
            hotels: item.hotels ? item.hotels.map(h => {
                h.check_in = new Date(h.check_in)
                h.check_out = new Date(h.check_out)
                h.type = ENTITY.HOTEL
                return h
            }) : [],
            places: item.places ? item.places.map(p => {
                p.time_start = new Date(p.time_start)
                p.time_end = new Date(p.time_end)
                p.type = ENTITY.PLACE
                return p
            }) : [],
            date_start: item.date_start ? new Date(item.date_start) : new Date(),
            date_end: item.date_end ? new Date(item.date_end) : new Date(),
        }

        this._travelDetailsFilter = defaultTravelDetailsFilter()

        this.change = this._new


        this._init()
    }

    _init() {
        this._modified.places.forEach(p => {
            if (!p._id) p._id = createId(this._modified.id)
            if (p.location.lat) {
                const {lat, lng} = p.location
                p.location = [lat, lng]
            }
            if (p.location) p.coords = p.location
            if (!p.visited) p.visited = 0
            delete p.date_start
            delete p.date_end
            return p
        })

        this._modified.waypoints.forEach(wp => wp.type = ENTITY.POINT)
    }

    /**
     * @method
     * @name BaseTravel.setCurtainOpen
     * @param {boolean} isOpen
     */
    setCurtainOpen(isOpen) {
        this._isCurtainOpen = isOpen

    }

    /**
     * @get
     * @name BaseTravel.isCurtainOpen
     * @return {boolean}
     */
    get isCurtainOpen() {
        return this._isCurtainOpen
    }


    /**
     * @param {TravelType} travel
     * @return {TravelType}
     * @private
     */
    _checkTravelFields(travel) {
        return travel
    }


    /**
     * от этого флага зависит бкдет ли записываться сущносьть Travel в бд или нет (если false)
     * @method
     * @name BaseTravel.setChange
     * @param {boolean} change
     * @returns {BaseTravel}
     */
    setChange(change) {
        if (typeof change === 'boolean') {
            this.change = change
        }
        return this
    }

    /**
     * от данного флага зависит какой экшен будет записан в бд ("add" / "update")
     * @method
     * @name BaseTravel.setNew
     * @param {boolean} isNew
     * @returns {BaseTravel}
     */
    setNew(isNew) {
        if (typeof isNew === 'boolean') {
            this._new = isNew
        }
        return this
    }

    /**
     * геттер возвращает значение id
     * @get
     * @name BaseTravel.id
     * @returns {string}
     */
    // get id() {
    //     return this._modified.id
    // }

    /**
     * метод устанавливает id путешествия
     * @method
     * @name BaseTravel.setID
     * @param {string} id id путешествия
     * @returns {BaseTravel}
     */
    setID(id) {
        if (typeof id === 'string' && id.length > 0) {
            this._modified.id = id
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает значение title
     * @get
     * @name BaseTravel.title
     * @returns {string}
     */
    // get title() {
    //     return this._modified.title
    // }

    /**
     * метод устанавливает title путешествия
     * @method
     * @name BaseTravel.setTitle
     * @param {string} title title путешествия
     * @returns {BaseTravel}
     */
    setTitle(title) {
        if (typeof title === 'string' && title.length > 0) {
            this._modified.title = title
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает значение direction
     * @get
     * @name BaseTravel.direction
     * @returns {string}
     */
    // get direction() {
    //     return this._modified.direction
    // }

    /**
     * метод устанавливает direction путешествия
     * @method
     * @name BaseTravel.setDirection
     * @param {string} direction direction путешествия
     * @returns {BaseTravel}
     */
    setDirection(direction) {
        if (typeof direction === 'string' && direction.length > 0) {
            this._modified.direction = direction
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает значение description
     * @get
     * @name BaseTravel.description
     * @returns {string}
     */
    // get description() {
    //     return this._modified.description
    // }

    /**
     * метод устанавливает description путешествия
     * @method
     * @name BaseTravel.setDescription
     * @param {string} description description путешествия
     * @returns {BaseTravel}
     */
    setDescription(description) {
        if (typeof description === 'string' && description.length > 0) {
            this._modified.description = description
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает значение owner_id
     * @get
     * @name BaseTravel.owner_id
     * @returns {string}
     */
    // get owner_id() {
    //     return this._modified.owner_id
    // }

    /**
     * метод устанавливает owner_id путешествия
     * @method
     * @name BaseTravel.setOwnerID
     * @param {string} owner_id owner_id путешествия
     * @returns {BaseTravel}
     */
    setOwnerID(owner_id) {
        if (typeof owner_id === 'string' && owner_id.length > 0) {
            this._modified.owner_id = owner_id
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает значение code
     * @get
     * @name BaseTravel.code
     * @returns {string}
     */
    // get code() {
    //     return this._modified.code
    // }

    /**
     * метод устанавливает code путешествия
     * @method
     * @name BaseTravel.setCode
     * @param {string} code code путешествия
     * @returns {BaseTravel}
     */
    setCode(code) {
        if (typeof code === 'string' && code.length > 0) {
            this._modified.code = code
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает значение photo
     * @get
     * @name BaseTravel.photo
     * @returns {string}
     */
    // get photo() {
    //     return this._modified.photo
    // }

    /**
     * метод устанавливает photo путешествия
     * @method
     * @name BaseTravel.setPhoto
     * @param {string} photo photo путешествия
     * @returns {BaseTravel}
     */
    setPhoto(photo) {
        if (typeof photo === 'string' && photo.length > 0) {
            this._modified.photo = photo
            this.change = true
        }
        return this
    }

    /**
     * геттер возврпщпет знасение поля date_start
     * @get
     * @name BaseTravel.date_start
     * @returns {string}
     */
    // get date_start() {
    //     return this._modified.date_start
    // }

    /**
     * установка поля date_start
     * @method
     * @name BaseTravel.setDateStart
     * @param {Date | string} date дата начала путешествия
     * @returns {BaseTravel}
     */
    setDateStart(date) {
        const d = date instanceof Date ? date : new Date(date || '')
        if (!Number.isNaN(d.getTime())) {
            this._modified.date_start = d
            this.forceUpdate()
        }
        return this
    }

    /**
     * геттер возврпщпет знасение поля date_end
     * @get
     * @name BaseTravel.date_end
     * @returns {string}
     */
    // get date_end() {
    //     return this._modified.date_end
    // }

    /**
     * установка поля date_end
     * @method
     * @name BaseTravel.setDateEnd
     * @param {Date | string} date дата конца путешествия
     * @returns {BaseTravel}
     */
    setDateEnd(date) {
        const d = date instanceof Date ? date : new Date(date || '')
        if (!Number.isNaN(d.getTime())) {
            this._modified.date_end = d
            this.forceUpdate()
        }
        return this
    }

    /**
     * геттер возврпщпет знасение поля updated_at
     * @get
     * @name BaseTravel.updated_at
     * @returns {string}
     */
    // get updated_at() {
    //     return this._modified.updated_at
    // }

    /**
     * установка поля updated_at
     * @method
     * @name BaseTravel.setUpdatedAt
     * @param {Date | string} date дата обновления путешествия
     * @returns {BaseTravel}
     */
    setUpdatedAt(date) {
        const d = new Date(date)
        if (!Number.isNaN(d.getTime())) {
            this._modified.updated_at = d.toISOString()
        }
        return this
    }

    /**
     * геттер возврпщпет знасение поля created_at
     * @get
     * @name BaseTravel.created_at
     * @returns {string}
     */
    // get created_at() {
    //     return this._modified.created_at
    // }

    /**
     * установка поля created_at
     * @method
     * @name BaseTravel.setCreatedAt
     * @param {Date | string} date дата обновления путешествия
     * @returns {BaseTravel}
     */
    setCreatedAt(date) {
        const d = new Date(date)
        if (!Number.isNaN(d.getTime())) {
            this._modified.created_at = d.toISOString()
        }
        return this
    }

    /**
     * геттер возврпщпет знасение поля isPublic
     * @get
     * @name BaseTravel.isPublic
     * @returns {DBFlagType}
     */
    // get isPublic() {
    //     return this._modified.isPublic
    // }

    /**
     * установка поля isPublic
     * @method
     * @name BaseTravel.setIsPublic
     * @param {DBFlagType} flag флаг видимости путешествия
     * @returns {BaseTravel}
     */
    setIsPublic(flag) {
        if (typeof flag === 'number' && (flag === 1 || flag === 0)) {
            this._modified.isPublic = flag
            this.change = true
        }
        return this
    }

    /**
     * Метод возвращает точку начала маршрута (если она установленна)
     * @get
     * @name BaseTravel.fromPoint
     * @returns {PointType | null}
     */
    get fromPoint() {
        if (this.isFromPoint) {
            return this._modified.waypoints[0]
        } else {
            return null
        }
    }

    // /**
    //  * геттер возврпщпет знасение поля isFromPoint
    //  * @get
    //  * @name BaseTravel.isFromPoint
    //  * @returns {boolean}
    //  */
    // get isFromPoint() {
    //     return this._modified.isFromPoint === 1
    // }

    /**
     * установка поля isFromPoint
     * @method
     * @name BaseTravel._setIsFromPoint
     * @param {DBFlagType} flag флаг начала маршрута путешествия
     * @returns {BaseTravel}
     * @private
     */
    _setIsFromPoint(flag) {
        if (typeof flag === 'number' && (flag === 1 || flag === 0)) {
            this._modified.isFromPoint = flag
            this.change = true
        }
        return this
    }

    /**
     * устнновка точки начала маршрута
     * @method
     * @name BaseTravel.setFromPoint
     * @param {PointType} point флаг видимости путешествия
     * @returns {BaseTravel}
     */
    setFromPoint(point) {
        if (typeof point === 'object' && point !== null) {
            !this._modified.isFromPoint
            && this._modified.waypoints.unshift(point)
            this._modified.isFromPoint = 1
            this.change = true
            this.forceUpdate()
        }
        return this
    }

    /**
     * удаление точки начала маршрута
     * @method
     * @name BaseTravel.removeFromPoint
     * @returns {BaseTravel}
     */
    removeFromPoint() {
        if (this.isFromPoint) {
            this._modified.isFromPoint = 0
            this._modified.waypoints.shift()
            this.change = true
        }
        return this
    }

    // /**
    //  * геттер поля childs_count
    //  * @method
    //  * @name BaseTravel.childs_count
    //  * @returns {number}
    //  */
    // get childs_count() {
    //     return this._modified.childs_count
    // }

    /**
     * установка поля childs_count
     * @method
     * @name BaseTravel.setChildsCount
     * @param {number} value число детей в путешествии
     * @returns {BaseTravel}
     */
    setChildsCount(value) {
        if (typeof value === 'number' && value >= 0) {
            this._modified.childs_count = value
            this.change = true
        }
        return this
    }

    // /**
    //  * геттер поля adults_count
    //  * @method
    //  * @name BaseTravel.adults_count
    //  * @returns {number}
    //  */
    // get adults_count() {
    //     return this._modified.adults_count
    // }

    /**
     * установка поля adults_count
     * @method
     * @name BaseTravel.setAdultsCount
     * @param {number} value число взрослых в путешествии
     * @returns {BaseTravel}
     */
    setAdultsCount(value) {
        if (typeof value === 'number' && value >= 0) {
            this._modified.adults_count = value
            this.change = true
        }
        return this
    }


    // /**
    //  * геттер возвращает список movementTypes
    //  * @get
    //  * @name BaseTravel.movementTypes
    //  * @returns {MovementType[]}
    //  */
    // get movementTypes() {
    //     return [...this._modified.movementTypes]
    // }

    /**
     * добавление способа перемещения
     * @method
     * @name BaseTravel.addMovementType
     * @param {MovementType} item способ перемещения
     * @returns {BaseTravel}
     */
    addMovementType(item) {
        if (item) {
            const idx = this.movementTypes.findIndex(mt => mt.id === item.id)
            ~idx
                ? this._modified.movementTypes[idx] = item
                : this._modified.movementTypes.push(item)
            this.change = true
        }
        return this
    }

    /**
     * устонавливает способы перемещения
     * @method
     * @name BaseTravel.addMovementType
     * @param {MovementType[]} items способ перемещения
     * @returns {BaseTravel}
     */
    setMovementTypes(items) {
        if (Array.isArray(items)) {
            this._modified.movementTypes = items
                .filter(item => !!item)
                .filter(item => item.id && item.title)
            this.change = true
        }
        return this
    }

    /**
     * удаляет способы перемещения
     * @method
     * @name BaseTravel.removeMovementType
     * @param {MovementType} item способ перемещения
     * @returns {BaseTravel}
     */
    removeMovementType(item) {
        if (item) {
            this._modified.movementTypes = this._modified.movementTypes.filter(mt => mt.id !== item.id)
        }
    }

    // /**
    //  * геттер возвращает список waypoints
    //  * @get
    //  * @name BaseTravel.waypoints
    //  * @returns {PointType[]}
    //  */
    // get waypoints() {
    //     return this._modified.waypoints
    // }

    /**
     * добавление (или обновление существующей) точки маршрута
     * @method
     * @name BaseTravel.addWaypoint
     * @param {PointType} item посещаемое место
     * @returns {BaseTravel}
     */
    addWaypoint(item) {
        if (item) {
            const idx = this._modified.waypoints.findIndex(p => p.id === item.id)
            if (~idx) {
                this._modified.waypoints.splice(idx, 1, item)
            } else {
                this._modified.waypoints.push(item)
            }
            this.change = true
            this._updateDirection()
        }
        return this
    }

    /**
     * удаление точки маршрута
     * @method
     * @name BaseTravel.removeWaypoint
     * @param {PointType} item посещаемое место
     * @returns {BaseTravel}
     */
    removeWaypoint(item) {
        if (item) {
            this._modified.waypoints = this._modified.waypoints.filter(i => item.id !== i.id)
            this.change = true
            this._updateDirection()
        }
        return this
    }

    /**
     * устонавливает посещаемые места
     * @method
     * @name BaseTravel.setWaypoints
     * @param {PointType[]} items посещаемые места
     * @returns {BaseTravel}
     */
    setWaypoints(items) {
        if (Array.isArray(items)) {
            this._modified.waypoints = items
            this.change = true
            this._updateDirection()
        }
        return this
    }

    // /**
    //  * геттер возвращает список places
    //  * @get
    //  * @name BaseTravel.places
    //  * @returns {PlaceType[]}
    //  */
    // get places() {
    //     return this._modified.places
    // }

    /**
     * добавление (или обновление существующей) точки маршрута
     * @method
     * @name BaseTravel.addPlace
     * @param {PlaceType} item посещаемое место
     * @returns {BaseTravel}
     */
    addPlace(item) {
        if (item) {
            this._modified.places.push(item)
            this.change = true
            this.routeBuilder.updateRoute()
            this.forceUpdate()
        }
        return this
    }

    /**
     * @method
     * @name BaseTravel.insertPlaceAfter
     * @param {PlaceType} after после
     * @param {PlaceType} insertedValue вставляемое значение
     * @returns {BaseTravel}
     */
    insertPlaceAfter(after, insertedValue){
        const idx = this._modified.places.findIndex(p => p.id === after.id)
        if(~idx)
            console.warn(new Error(`element ${after} not found`))

        this._modified.places.splice(idx + 1, 0, insertedValue)
        this.forceUpdate()
        return this
    }

    /**
     * обновление точки маршрута
     * @method
     * @name BaseTravel.updatePlace
     * @param {PlaceType} item посещаемое место
     * @returns {BaseTravel}
     */
    updatePlace(item) {
        const idx = this._modified.places.findIndex(p => p._id === item._id)
        if (~idx) {
            this.change = true
            const newArray = [...this._modified.places]
            newArray[idx] = item
            this._modified.places = newArray
            this.routeBuilder.updateRoute()
            this.forceUpdate()
        }
        return this
    }

    /**
     * удаление точки маршрута
     * @method
     * @name BaseTravel.removePlace
     * @param {PlaceType} item посещаемое место
     * @returns {BaseTravel}
     */
    removePlace(item) {
        if (item) {
            this._modified.places = this._modified.places.filter(i => item._id !== i._id)
            this.change = true
            this.routeBuilder.updateRoute()
            this.forceUpdate()
        }
        return this
    }

    /**
     * устонавливает посещаемые места
     * @method
     * @name BaseTravel.setPlaces
     * @param {PlaceType[]} items посещаемые места
     * @returns {BaseTravel}
     */
    setPlaces(items) {
        if (Array.isArray(items)) {
            this._modified.places = items
            this.change = true
            this._updateDirection()
            this.routeBuilder.updateRoute()
            this.forceUpdate()
        }
        return this
    }

    /**
     * сортировка мест по дистанции
     * @method
     * @name BaseTravel.sortPlaces
     * @param {(point_1: CoordinatesType, point_2: CoordinatesType) => number} distanceCB callback, возвращает число, которое будет использоваться как вес ребра
     */
    sortPlaces(distanceCB) {
        this.routeBuilder.sortByGeneticAlgorithm(this.places)
    }

    _updateDirection() {
        this._modified.direction = this._modified.waypoints
            .reduce((acc, p) => {
                let place = p.locality?.length > 0
                    ? p.locality
                    : p.address?.split(',').filter(pl => !pl.includes('область')).shift() || ''
                place = place.trim()
                return acc ? acc + ' - ' + place : place
            }, '')
    }

    // /**
    //  * геттер возвращает список members
    //  * @get
    //  * @name BaseTravel.members
    //  * @returns {MemberType[]}
    //  */
    // get members() {
    //     return [...this._modified.members]
    // }

    /**
     * добавление участника путешествия
     * @method
     * @name BaseTravel.addMember
     * @param {MemberType} item посещаемое место
     * @returns {BaseTravel}
     */
    addMember(item) {
        if (item) {
            const idx = this._modified.members.findIndex(m => m.id === item.id)
            ~idx
                ? this._modified.members[idx] = item
                : this._modified.members.push(item)
            this.change = true
        }
        return this
    }

    /**
     * добавление участников путешествия
     * @method
     * @name BaseTravel.setMembers
     * @param {MemberType[]} items посещаемое место
     * @returns {BaseTravel}
     */
    setMembers(items) {
        if (Array.isArray(items)) {
            this._modified.members = [...items]
            this.change = true
        }
        return this
    }

    /**
     * удаляет участников путешествия
     * @method
     * @name BaseTravel.removeMember
     * @param {MemberType} item посещаемое место
     * @returns {BaseTravel}
     */
    removeMember(item) {
        if (item) {
            this._modified.members = this._modified.members.filter(m => m.id !== item.id)
            this.change = true
        }
        return this
    }

    // /**
    //  * геттер возвращает список hotels
    //  * @get
    //  * @name BaseTravel.hotels
    //  * @returns {HotelType[]}
    //  */
    // get hotels() {
    //     return [...this._modified.hotels]
    // }

    /**
     * добавление отеля
     * @method
     * @name BaseTravel.addHotel
     * @param {HotelType} item добавляемый отель
     * @returns {BaseTravel}
     */
    addHotel(item) {
        if (item) {
            const idx = this._modified.hotels.findIndex(h => h.id === item.id)
            idx
                ? this._modified.hotels[idx] = item
                : this._modified.hotels.push(item)
            this.change = true
        }
        return this
    }

    /**
     * добавление отелей
     * @method
     * @name BaseTravel.setHotels
     * @param {HotelType[]} items добавляемый отель
     * @returns {BaseTravel}
     */
    setHotels(items) {
        if (Array.isArray(items)) {
            this._modified.hotels = [...items]
            this.change = true
        }
        return this
    }

    /**
     * удаление отелей
     * @method
     * @name BaseTravel.removeHotel
     * @param {HotelType} item удалемый отель
     * @returns {BaseTravel}
     */
    removeHotel(item) {
        if (item) {
            this._modified.hotels = this._modified.hotels.filter(h => h.id !== item.id)
            this.change = true
        }
        return this
    }

    // /**
    //  * геттер возвращает список appointments
    //  * @get
    //  * @name BaseTravel.appointments
    //  * @returns {AppointmentType[]}
    //  */
    // get appointments() {
    //     return [...this._modified.appointments]
    // }

    /**
     * добавление встречи
     * @method
     * @name BaseTravel.addAppointment
     * @param {AppointmentType} item добавляемый отель
     * @returns {BaseTravel}
     */
    addAppointment(item) {
        if (item) {
            const idx = this._modified.appointments.findIndex(a => a.id === item.id)
            ~idx
                ? this._modified.appointments[idx] = item
                : this._modified.appointments.push(item)
            this.change = true
        }
        return this
    }

    /**
     * добавление встреч
     * @method
     * @name BaseTravel.setAppointments
     * @param {AppointmentType[]} items добавляемый отель
     * @returns {BaseTravel}
     */
    setAppointments(items) {
        if (Array.isArray(items)) {
            this._modified.appointments = [...items]
            this.change = true
        }
        return this
    }

    /**
     * добавление встреч
     * @method
     * @name BaseTravel.removeAppointment
     * @param {AppointmentType} item добавляемый отель
     * @returns {BaseTravel}
     */
    removeAppointment(item) {
        if (item) {
            this._modified.appointments = this._modified.appointments.filter(a => a.id !== item.id)
            this.change = true
        }
        return this
    }

    /**
     * метод устанавливает id пользователя, который редактирует путешествие,
     * в дальнейшем при сохранении / изменении в бд записи об этом лимите, будет использоваться данный лимит
     * @method
     * @name BaseTravel.setUser
     * @param {string} user_id id пользователя, который редактирует путешествие
     * @returns {BaseTravel}
     */
    setUser(user_id) {
        if (typeof user_id === 'string' && user_id.length > 0) {
            this.user_id = user_id
        }
        return this
    }

    /**
     * @get
     * @name BaseTravel.travelDetailsFilter
     * @returns {TravelDetailsFilterType}
     */
    get travelDetailsFilter() {
        return this._travelDetailsFilter
    }

    /**
     * @method
     * @name BaseTravel.setTravelDetailsFilter
     * @param {TravelDetailsFilterType} value
     * @returns {BaseTravel}
     */
    setTravelDetailsFilter(value) {
        if (typeof value === 'string' && value.length) {
            localStorage.setItem(DEFAULT_TRAVEL_DETAILS_FILTER, value)
            this._travelDetailsFilter = value
            this.forceUpdate()
        }
        return this

    }

    /**
     * возвращает количество дней в путешествии
     * @get
     * @name BaseTravel.days
     * @returns {number|number}
     */
    get days() {
        let days = (new Date(this._modified.date_end).getTime() - new Date(this._modified.date_start).getTime()) / MS_IN_DAY
        days = Math.ceil(days)
        return days ? days : this.routeBuilder.days


    }

    /**
     * @method
     * @name BaseTravel.forceUpdate
     * @abstract
     */
    forceUpdate() {
    }

    /**
     * метод реализует создание / обновление заприси о путешествии в бд
     * @method
     * @name BaseTravel.save
     * @param {string} user_id id пользователя, который редактирует запись о путешествие
     * @returns {Promise<BaseTravel>}
     */
    async save(user_id) {
        const userOK = typeof user_id === 'string' && user_id.length > 0
        // appointments: item.appointments ? item.appointments.map(a => {
        //     a.date = new Date(a.date)
        //     return a
        // }) : [] ,
        //     hotels: item.hotels ? item.appointments.map(h => {
        //     h.check_in = new Date(h.check_in)
        //     h.check_out = new Date(h.check_out)
        //     return h
        // }) : [] ,
        //     places: item.places ? item.appointments.map(p => {
        //     p.time_start = new Date(p.time_start)
        //     p.time_end = new Date(p.time_end)
        //     return p
        // }) : [] ,
        //     date_start : item.date_start ? new Date(item.date_start) : new Date(),
        //     date_end : item.date_end ? new Date(item.date_end) : new Date(),
        /**@type{TravelStoreType}*/
        const travelDTO = {...this._modified}
        travelDTO.appointments.forEach(a => a.date = a.date.toISOString())
        travelDTO.hotels = travelDTO.hotels.map(h => {
            /**@type{HotelStoreType}*/
            const nh = {
                ...h,
                check_in: h.check_in.toISOString(),
                check_out: h.check_out.toISOString(),
            }
            delete nh.type
            return nh
        })

        travelDTO.places = travelDTO.places.map(p => {
            const np = {
                ...p,
                time_start: p.time_start.toISOString(),
                time_end: p.time_end.toISOString()
            }
            delete np.type
            return np
        })

        travelDTO.waypoints = travelDTO.waypoints.map(wp => {
            const nwp = {...wp}
            delete nwp.type
            return nwp
        })

        travelDTO.date_start = travelDTO.date_start.toISOString()
        travelDTO.date_end = travelDTO.date_end.toISOString()

        if (this.change) {
            this._new
                ? await travel_service.create(travelDTO, userOK ? user_id : this.user_id)
                : await travel_service.update(travelDTO, userOK ? user_id : this.user_id)
        }
        this.change = false
        return this
    }

    /**
     * метод реализует удаление заприси о путешествии из бд
     * @method
     * @name BaseTravel.delete
     * @param user_id id пользователя, который удаляет путешествие
     * @returns {Promise<BaseTravel>}
     */
    async delete(user_id) {
        const userOK = typeof user_id === 'string' && user_id.length > 0

        if (userOK || this.user_id) {
            await travel_service.delete(this._modified, userOK ? user_id : this.user_id)
        }
        return this
    }


}
