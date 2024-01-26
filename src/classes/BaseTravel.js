import Entity from "./Entity";
import travel_service from "../services/travel-service";
import {
    DEFAULT_TRAVEL_DETAILS_FILTER,
    ENTITY, DENSITY,
    MS_IN_DAY,
    SPEED, VISIBILITY
} from "../static/constants";
import defaultTravelDetailsFilter from "../utils/default-values/defaultTravelDetailsFilter";
import createId from "../utils/createId";
import {nanoid} from "nanoid";
import getDistanceFromTwoPoints from "../utils/getDistanceFromTwoPoints";
import TimeHelper from "./TimeHelper";
import {defaultMovementTags} from '../components/defaultMovementTags'

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
    /**@type{TravelType} */
    static initValue = {
        id: () => '',
        code: () => '',
        title: () => '',
        direction: () => '',
        description: () => '',
        owner_id: () => '',
        created_at: () => new Date(),
        updated_at: () => new Date(),
        appointments: () => [],
        members: () => [],
        hotels: () => [],
        movementTypes: () => defaultMovementTypes,
        waypoints: () => [],
        places: () => [],
        members_count: () => 1,
        children_count: () => 0,
        date_start: () => new Date(),
        date_end: () => new Date(),
        isPublic: () => 0,
        photo: () => '',
        isFromPoint: () => 0,
        days: () => 1,
        preferences: () => ({
            density: 2,
            eventsRate: DENSITY.NORMAL
        }),
        permissions: () => ({}),
        visibility: () => VISIBILITY.COMMENTS | VISIBILITY.EXPENSES | VISIBILITY.CHECKLIST | VISIBILITY.ROUTE,
    }
    /***@type{TravelType} */
    _modified = {}

    /**@type{RouteBuilder}*/
    routeBuilder

    /**@type{TravelDetailsFilterType}*/
    _travelDetailsFilter

    _isCurtainOpen = true

    /**@type{TimeHelper}*/
    timeHelper

    /**
     * @param {TravelType} item
     * @param {string} travelCode
     * @constructor
     */
    constructor(item, travelCode) {
        super()
        if (!item) {
            item = {}
            this._new = true
        }

        this.timeHelper = new TimeHelper(9 * 60 * 60 * 1000, 19 * 60 * 60 * 1000)

        Object
            .keys(BaseTravel.initValue)
            .forEach(key => this._modified[key] = BaseTravel.initValue[key]())

        if (travelCode)
            this._modified.id = travelCode

        // this.routeBuilder = new RouteBuilder({
        //     travel: this,
        //     places: this._modified.places,
        //     appointments: this._modified.appointments,
        //     waypoints: this._modified.waypoints
        // })

        // this._checkTravelFields(item)
        this._modified = {
            ...this._modified,
            ...item,
            appointments: item.appointments ? item.appointments.map(a => {
                a.date = new Date(a.date)
                return a
            }) : [],
            places: item.places ? item.places.map(p => ({
                ...p,
                time_start: new Date(p.time_start || 0),
                time_end: new Date(p.time_end || p.time_start + 30 * 60 * 1000 * this._modified.preferences.density || 2),
                type: 2001,
            })) : [],
            __route: [],
        }

        this._modified.date_start = new Date(this._modified.date_start)
        this._modified.date_end = new Date(this._modified.date_end)

        this._modified.__days = Math.floor((this._modified.date_end.getTime() - this._modified.date_start.getTime()) / MS_IN_DAY)
        this._travelDetailsFilter = defaultTravelDetailsFilter()

        this.change = this._new


        this._init()
        this._calcRoute()
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

    _calcRoute() {
        this._modified.__route = []
        const places = this._modified.places.sort((a, b) => a.time_start - b.time_start)
        if (places.length === 0) return

        let prevPlace = places[0]
        this._modified.__route[0] = prevPlace
        let index = 1
        while (places[index]) {
            const nextPlace = places[index]

            const distance = getDistanceFromTwoPoints(prevPlace.coords, nextPlace.coords)
            const duration = (distance / SPEED.CAR_SPEED) * 1000
            /** @type{MovingType} */
            const moving = {
                id: nanoid(5),
                type: 2005,
                distance: distance,
                duration: duration,
                from: prevPlace,
                to: nextPlace,
                start: new Date(prevPlace.time_end),
                end: new Date(prevPlace.time_end.getTime() + duration),
            }

            if (moving.end > nextPlace.time_start)
                nextPlace.__expire = true

            this._modified.__route.push(moving)
            this._modified.__route.push(nextPlace)
            prevPlace = nextPlace

            index++
        }
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

    // /**
    //  * геттер возвращает значение id
    //  * @get
    //  * @name BaseTravel.id
    //  * @returns {string}
    //  */
    // // get id() {
    // //     return this._modified.id
    // // }

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

    // /**
    //  * геттер возвращает значение title
    //  * @get
    //  * @name BaseTravel.title
    //  * @returns {string}
    //  */
    // // get title() {
    // //     return this._modified.title
    // // }

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

    // /**
    //  * геттер возвращает значение direction
    //  * @get
    //  * @name BaseTravel.direction
    //  * @returns {string}
    //  */
    // // get direction() {
    // //     return this._modified.direction
    // // }

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

    // /**
    //  * геттер возвращает значение description
    //  * @get
    //  * @name BaseTravel.description
    //  * @returns {string}
    //  */
    // // get description() {
    // //     return this._modified.description
    // // }

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

    // /**
    //  * геттер возвращает значение owner_id
    //  * @get
    //  * @name BaseTravel.owner_id
    //  * @returns {string}
    //  */
    // // get owner_id() {
    // //     return this._modified.owner_id
    // // }

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

    // /**
    //  * геттер возвращает значение code
    //  * @get
    //  * @name BaseTravel.code
    //  * @returns {string}
    //  */
    // // get code() {
    // //     return this._modified.code
    // // }

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

    // /**
    //  * геттер возвращает значение photo
    //  * @get
    //  * @name BaseTravel.photo
    //  * @returns {string}
    //  */
    // // get photo() {
    // //     return this._modified.photo
    // // }

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
            this.emit('date_start', [this._modified.date_start])
        }
        return this
    }

    // /**
    //  * геттер возврпщпет знасение поля date_start
    //  * @get
    //  * @name BaseTravel.date_start
    //  * @returns {string}
    //  */
    // // get date_start() {
    // //     return this._modified.date_start
    // // }

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
            d.setHours(0, 0, 0, 0)
            this._modified.date_start = d
            this.emit('date_start', [this._modified.date_start])
            this.change = true
        }
        return this
    }

    // /**
    //  * геттер возврпщпет знасение поля date_end
    //  * @get
    //  * @name BaseTravel.date_end
    //  * @returns {string}
    //  */
    // // get date_end() {
    // //     return this._modified.date_end
    // // }

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
            d.setHours(23, 59, 59, 999)
            this._modified.date_end = d
            this.emit('date_end', [this._modified.date_end])
            this.change = true
        }
        return this
    }

    // /**
    //  * геттер возврпщпет знасение поля updated_at
    //  * @get
    //  * @name BaseTravel.updated_at
    //  * @returns {string}
    //  */
    // // get updated_at() {
    // //     return this._modified.updated_at
    // // }

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
            this._modified.updated_at = d
            this.emit('updated_at', [this._modified.updated_at])
            this.change = true
        }
        return this
    }

    // /**
    //  * геттер возврпщпет знасение поля created_at
    //  * @get
    //  * @name BaseTravel.created_at
    //  * @returns {string}
    //  */
    // // get created_at() {
    // //     return this._modified.created_at
    // // }

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
            this._modified.created_at = d
            this.emit('created_at', [this._modified.created_at])
            this.change = true
        }
        return this
    }

    // /**
    //  * геттер возврпщпет знасение поля isPublic
    //  * @get
    //  * @name BaseTravel.isPublic
    //  * @returns {DBFlagType}
    //  */
    // // get isPublic() {
    // //     return this._modified.isPublic
    // // }

    /**
     * число дней на которое планируется путешествие
     * @method
     * @name BaseTravel.setDays
     * @param {number} d
     * @returns {BaseTravel}
     */
    setDays(d) {
        if (d > 0) {
            this._modified.days = d
            this._modified.date_end = new Date(this._modified.date_start + d * MS_IN_DAY)
            this.emit('days', [d])
            this.emit('date_end', [this._modified.date_end])
            this.change = true
        }
        return this
    }

    /**
     * установка установка настроек видимости маршрута
     * @method
     * @name BaseTravel.setVisibility
     * @param {number} visibilitySettings флаг видимости путешествия
     * @returns {BaseTravel}
     */
    setVisibility(visibilitySettings) {
        if (typeof visibilitySettings === 'number') {
            this._modified.visibility = visibilitySettings
            this.emit('visibility', [this._modified.visibility])
            this.change = true
        }
        return this
    }

    /**
     * установка дефолтных предпочтений путешествий (глубина осмотра, насыщенность ...)
     * @method
     * @name BaseTravel.setPreferences
     * @param {Partial<TravelPreferenceType>} options
     * @return {BaseTravel}
     */
    setPreferences(options) {
        if (options) {
            this._modified.preferences = {
                ...this._modified.preferences,
                ...options
            }
            this.emit('preferences', [this._modified.preferences])
            this.change = true
        }
        return this
    }

    /**
     * Метод возвращает точку начала маршрута (если она установленна)
     * @get
     * @name BaseTravel.fromPoint
     * @returns {WaypointType | null}
     */
    get fromPoint() {
        if (this._modified.isFromPoint) {
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
     * @param {WaypointType} point флаг видимости путешествия
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
        if (this._modified.isFromPoint) {
            this._modified.isFromPoint = 0
            this._modified.waypoints.shift()
            this.change = true
            this.emit('waypoints', [this._modified.waypoints])
        }
        return this
    }

    // /**
    //  * геттер поля children_count
    //  * @method
    //  * @name BaseTravel.children_count
    //  * @returns {number}
    //  */
    // get children_count() {
    //     return this._modified.children_count
    // }

    /**
     * установка поля children_count
     * @method
     * @name BaseTravel.setChildsCount
     * @param {number} value число детей в путешествии
     * @returns {BaseTravel}
     */
    setChildsCount(value) {
        if (typeof value === 'number' && value >= 0) {
            this._modified.children_count = value
            this.change = true
            this.emit('children_count', [this._modified.children_count])
        }
        return this
    }

    // /**
    //  * геттер поля members_count
    //  * @method
    //  * @name BaseTravel.members_count
    //  * @returns {number}
    //  */
    // get members_count() {
    //     return this._modified.members_count
    // }

    /**
     * установка поля members_count
     * @method
     * @name BaseTravel.setAdultsCount
     * @param {number} value число взрослых в путешествии
     * @returns {BaseTravel}
     */
    setAdultsCount(value) {
        if (typeof value === 'number' && value >= 0) {
            this._modified.members_count = value
            this.change = true
            this.emit('members_count', [this._modified.members_count])
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
            const idx = this._modified.movementTypes.findIndex(mt => mt.id === item.id)
            ~idx
                ? this._modified.movementTypes[idx] = item
                : this._modified.movementTypes.push(item)
            this.change = true
            this.emit('movementTypes', [this._modified.movementTypes])
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
            this.emit('movementTypes', [this._modified.movementTypes])
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
            this.emit('movementTypes', [this._modified.movementTypes])
            this.change = true
        }
    }

    // /**
    //  * геттер возвращает список waypoints
    //  * @get
    //  * @name BaseTravel.waypoints
    //  * @returns {WaypointType[]}
    //  */
    // get waypoints() {
    //     return this._modified.waypoints
    // }

    /**
     * добавление (или обновление существующей) точки маршрута
     * @method
     * @name BaseTravel.addWaypoint
     * @param {WaypointType} item посещаемое место
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
            this.emit('waypoints', [this._modified.waypoints])
        }
        return this
    }

    /**
     * удаление точки маршрута
     * @method
     * @name BaseTravel.removeWaypoint
     * @param {WaypointType} item посещаемое место
     * @returns {BaseTravel}
     */
    removeWaypoint(item) {
        if (item) {
            this._modified.waypoints = this._modified.waypoints.filter(i => item.id !== i.id)
            this.change = true
            this._updateDirection()
            this.emit('waypoints', [this._modified.waypoints])
        }
        return this
    }

    /**
     * устонавливает посещаемые места
     * @method
     * @name BaseTravel.setWaypoints
     * @param {WaypointType[]} items посещаемые места
     * @returns {BaseTravel}
     */
    setWaypoints(items) {
        if (Array.isArray(items)) {
            this._modified.waypoints = items
            this.change = true
            this._updateDirection()
            this.emit('waypoints', [this._modified.waypoints])
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
            this._calcRoute()
            this.change = true
            this.emit('places', [this._modified.places])
            this.emit('route', [this._modified.__route])
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
    insertPlaceAfter(after, insertedValue) {
        const idx = this._modified.places.findIndex(p => p.id === after.id)
        if (~idx)
            console.warn(new Error(`element ${after} not found`))

        this._modified.places.splice(idx + 1, 0, insertedValue)
        this._calcRoute()
        this.emit('places', [this._modified.places])
        this.emit('route', [this._modified.__route])
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
            this._calcRoute()
            this.emit('places', [this._modified.places])
            this.emit('route', [this._modified.__route])
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
            this._calcRoute()
            this.emit('places', [this._modified.places])
            this.emit('route', [this._modified.__route])
            this.change = true
            this.forceUpdate()

        }
        return this
    }

    _sortPlaces() {
        // this._modified.places.sort((a,b) => {
        //     if(!a.__day) return 1
        //     else if()
        // })
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
            this._calcRoute()
            this.emit('route', [this._modified.__route])
            this.emit('places', [this._modified.places])
            this.change = true
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
        this.emit('direction', [this._modified.direction])
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
            const idx = this._modified.members.findIndex(m => m === item.id)
            if (~idx) {
                this._modified.members.push(item.id)
                this.emit('members', [this._modified.members])
                this.change = true
            }
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
            this._modified.members = items.map(item => item.id)
            this.emit('members', [this._modified.members])
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
            this._modified.members = this._modified.members.filter(m => m !== item.id)
            this.emit('members', [this._modified.members])
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

    // /**
    //  * добавление отеля
    //  * @method
    //  * @name BaseTravel.addHotel
    //  * @param {HotelType} item добавляемый отель
    //  * @returns {BaseTravel}
    //  * @deprecated
    //  */
    // addHotel(item) {
    //     if (item) {
    //         const idx = this._modified.hotels.findIndex(h => h.id === item.id)
    //         idx
    //             ? this._modified.hotels[idx] = item
    //             : this._modified.hotels.push(item)
    //         this.change = true
    //     }
    //     return this
    // }

    // /**
    //  * добавление отелей
    //  * @method
    //  * @name BaseTravel.setHotels
    //  * @param {HotelType[]} items добавляемый отель
    //  * @returns {BaseTravel}
    //  * @deprecated
    //  */
    // setHotels(items) {
    //     if (Array.isArray(items)) {
    //         this._modified.hotels = [...items]
    //         this.change = true
    //     }
    //     return this
    // }
    //
    // /**
    //  * удаление отелей
    //  * @method
    //  * @name BaseTravel.removeHotel
    //  * @param {HotelType} item удалемый отель
    //  * @returns {BaseTravel}
    //  * @deprecated
    //  */
    // removeHotel(item) {
    //     if (item) {
    //         this._modified.hotels = this._modified.hotels.filter(h => h.id !== item.id)
    //         this.change = true
    //     }
    //     return this
    // }

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
            this.emit('appointments', [this._modified.appointments])
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
            this.emit('appointments', [this._modified.appointments])
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
            this.emit('appointments', [this._modified.appointments])
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
            this.emit('user_id', [user_id])
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
            this.emit('travelDetailsFilter', [value])
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
        return this._modified.__days


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

        /**@type{TravelStoreType}*/
        const travelDTO = {}
        Object
            .keys(this._modified)
            .filter(key => !key.startsWith('__'))
            .forEach(key => travelDTO[key] = this._modified[key])

        travelDTO.appointments.forEach(a => a.date = a.date.toISOString())

        travelDTO.places = travelDTO.places.map(p => {
            const np = {...p}
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

        /**@type{TravelStoreType}*/
        const travelDTO = {}
        Object
            .keys(this._modified)
            .filter(key => !key.startsWith('__'))
            .forEach(key => travelDTO[key] = this._modified[key])

        if (userOK || this.user_id) {
            await travel_service.delete(travelDTO, userOK ? user_id : this.user_id)
        }
        return this
    }
}
