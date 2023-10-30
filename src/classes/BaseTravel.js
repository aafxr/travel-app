import Entity from "./Entity";
import travel_service from "../services/travel-service";
import {defaultMovementTags} from "../static/constants";

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
        created_at: () => new Date().toISOString(),
        updated_at: () => new Date().toISOString(),
        appointments: () => [],
        members: () => [],
        hotels: () => [],
        movementTypes: () => defaultMovementTypes,
        waypoints: () => [],
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

    /**
     * @param {TravelType} item
     * @constructor
     */
    constructor(item) {
        super()
        if (!item) {
            item = {}
            this._new = true
        }

        Object
            .keys(BaseTravel.initValue)
            .forEach(key => this._modified[key] = BaseTravel.initValue[key]())

        this
            .setID(item.id)
            .setCode(item.code)
            .setTitle(item.title)
            .setDirection(item.direction)
            .setDescription(item.description)
            .setOwnerID(item.owner_id)
            .setCreatedAt(item.created_at)
            .setUpdatedAt(item.updated_at)
            .setAppointments(item.appointments)
            .setMembers(item.members)
            .setHotels(item.hotels)
            .setMovementTypes(item.movementTypes?.length > 0 && item.movementTypes)
            .setWaypoints(item.waypoints)
            .setAdultsCount(item.adults_count)
            .setChildsCount(item.childs_count)
            .setDateStart(item.date_start)
            .setDateEnd(item.date_end)
            .setIsPublic(item.isPublic)
            ._setIsFromPoint(item.isFromPoint)
            .setPhoto(item.photo)

        this.change = this._new
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
    get id() {
        return this._modified.id
    }

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
    get title() {
        return this._modified.title
    }

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
    get direction() {
        return this._modified.direction
    }

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
    get description() {
        return this._modified.description
    }

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
    get owner_id() {
        return this._modified.owner_id
    }

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
    get code() {
        return this._modified.code
    }

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
    get photo() {
        return this._modified.photo
    }

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
    get date_start() {
        return this._modified.date_start
    }

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
            this._modified.date_start = d.toISOString()
        }
        return this
    }

    /**
     * геттер возврпщпет знасение поля date_end
     * @get
     * @name BaseTravel.date_end
     * @returns {string}
     */
    get date_end() {
        return this._modified.date_end
    }

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
            this._modified.date_end = d.toISOString()
        }
        return this
    }

    /**
     * геттер возврпщпет знасение поля updated_at
     * @get
     * @name BaseTravel.updated_at
     * @returns {string}
     */
    get updated_at() {
        return this._modified.updated_at
    }

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
    get created_at() {
        return this._modified.created_at
    }

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
    get isPublic() {
        return this._modified.isPublic
    }

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

    /**
     * геттер возврпщпет знасение поля isFromPoint
     * @get
     * @name BaseTravel.isFromPoint
     * @returns {boolean}
     */
    get isFromPoint() {
        return this._modified.isFromPoint === 1
    }

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
            this.isFromPoint
                ? this._modified.waypoints[0] = point
                : this._modified.waypoints.unshift(point)
            this._modified.isFromPoint = 1
            this.change = true
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

    /**
     * геттер поля childs_count
     * @method
     * @name BaseTravel.childs_count
     * @returns {number}
     */
    get childs_count() {
        return this._modified.childs_count
    }

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

    /**
     * геттер поля adults_count
     * @method
     * @name BaseTravel.adults_count
     * @returns {number}
     */
    get adults_count() {
        return this._modified.adults_count
    }

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


    /**
     * геттер возвращает список movementTypes
     * @get
     * @name BaseTravel.movementTypes
     * @returns {MovementType[]}
     */
    get movementTypes() {
        return [...this._modified.movementTypes]
    }

    /**
     * добавление способа перемещения
     * @method
     * @name BaseTravel.addMovementType
     * @param {MovementType} item способ перемещения
     * @returns {BaseTravel}
     */
    addMovementType(item) {
        if (item) {
            this._modified.movementTypes.push(item)
            this.change = true
        }
        return this
    }

    /**
     * устонавливаетспособы перемещения
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
     * геттер возвращает список waypoints
     * @get
     * @name BaseTravel.waypoints
     * @returns {PointType[]}
     */
    get waypoints() {
        return this._modified.waypoints
    }

    /**
     * добавление (или обновление существующей) точки маршрута
     * @method
     * @name BaseTravel.addWaypoint
     * @param {PointType} item посещаемое место
     * @returns {BaseTravel}
     */
    addWaypoint(item) {
        if (item) {
            const idx = this.waypoints.findIndex(p => p.id === item.id)
            if (~idx) {
                this.waypoints.splice(idx, 1, item)
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

    _updateDirection() {
        this._modified.direction = this.waypoints
            .reduce((acc, p) => {
                let place = p.locality?.length > 0
                    ? p.locality
                    : p.address?.split(',').filter(pl => !pl.includes('область')).shift() || ''
                place = place.trim()
                return acc ? acc + ' - ' + place : place
            }, '')
    }

    /**
     * геттер возвращает список members
     * @get
     * @name BaseTravel.members
     * @returns {MemberType[]}
     */
    get members() {
        return [...this._modified.members]
    }

    /**
     * добавление участника путешествия
     * @method
     * @name BaseTravel.addMember
     * @param {MemberType} item посещаемое место
     * @returns {BaseTravel}
     */
    addMember(item) {
        if (item) {
            this._modified.members.push(item)
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
     * геттер возвращает список hotels
     * @get
     * @name BaseTravel.hotels
     * @returns {HotelType[]}
     */
    get hotels() {
        return [...this._modified.hotels]
    }

    /**
     * добавление отеля
     * @method
     * @name BaseTravel.addHotel
     * @param {HotelType} item добавляемый отель
     * @returns {BaseTravel}
     */
    addHotel(item) {
        if (item) {
            this._modified.hotels.push(item)
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
     * геттер возвращает список appointments
     * @get
     * @name BaseTravel.appointments
     * @returns {AppointmentType[]}
     */
    get appointments() {
        return [...this._modified.appointments]
    }

    /**
     * добавление встречи
     * @method
     * @name BaseTravel.addAppointment
     * @param {AppointmentType} item добавляемый отель
     * @returns {BaseTravel}
     */
    addAppointment(item) {
        if (item) {
            this._modified.appointments.push(item)
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
     * метод реализует создание / обновление заприси о путешествии в бд
     * @method
     * @name BaseTravel.save
     * @param {string} user_id id пользователя, который редактирует запись о путешествие
     * @returns {Promise<BaseTravel>}
     */
    async save(user_id) {
        const userOK = typeof user_id === 'string' && user_id.length > 0
        /**@type{TravelType}*/
        const travelDTO = {...this._modified}
        travelDTO.waypoints = travelDTO.waypoints.map(({address, id, locality, coords, kind}) => ({
            address, id, locality, coords, kind, placemark: null
        }))
        console.log('travelDTO ', travelDTO)
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