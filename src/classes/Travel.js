import travel_service from "../services/travel-service";

/**
 * класс для редактирования и сохранения в бд путешествия
 * @class
 * @name Travel
 *
 *
 * @param {TravelType} item
 * @constructor
 */
export default class Travel{
    newTravel = false
    /***@type{TravelType} */
    _modified
    /**
     * @param {TravelType} item
     * @constructor
     */
    constructor(item) {
        if(!item){
            item = {}
            this.newTravel = true
        }


        this._modified = {}
        this
            .setID(item.id)
            .setCode(item.code)
            .setTitle(item.title)
            .setDirection(item.direction)
            .setOwnerID(item.owner_id)
            .setCreatedAt(item.created_at)
            .setUpdatedAt(item.updated_at)
            .setAppointments(item.appointments)
            .setMembers(item.members)
            .setHotels(item.hotels)
            .setMovementTypes(item.movementTypes)
            .setWaypoints(item.waypoints)
            .setAdultsCount(item.adults_count)
            .setChildsCount(item.childs_count)
            .setDateStart(item.date_start)
            .setDateEnd(item.date_end)
            .setIsPublic(item.isPublic)
            .setPhoto(item.photo)

        //photo
        //owner

        this.change = this.newTravel
    }

    /**
     * геттер возвращает значение id
     * @get
     * @name Travel.id
     * @returns {string}
     */
    get id(){
        return this._modified.id
    }

    /**
     * метод устанавливает id путешествия
     * @method
     * @name Travel.setID
     * @param {string} id id путешествия
     * @returns {Travel}
     */
    setID(id){
        if (typeof id === 'string' && id.length > 0) {
            this._modified.id = id
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает значение title
     * @get
     * @name Travel.title
     * @returns {string}
     */
    get title(){
        return this._modified.title
    }

    /**
     * метод устанавливает title путешествия
     * @method
     * @name Travel.setTitle
     * @param {string} title title путешествия
     * @returns {Travel}
     */
    setTitle(title){
        if (typeof title === 'string' && title.length > 0) {
            this._modified.title = title
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает значение direction
     * @get
     * @name Travel.direction
     * @returns {string}
     */
    get direction(){
        return this._modified.direction
    }

    /**
     * метод устанавливает direction путешествия
     * @method
     * @name Travel.setDirection
     * @param {string} direction direction путешествия
     * @returns {Travel}
     */
    setDirection(direction){
        if (typeof direction === 'string' && direction.length > 0) {
            this._modified.direction = direction
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает значение owner_id
     * @get
     * @name Travel.owner_id
     * @returns {string}
     */
    get owner_id(){
        return this._modified.owner_id
    }

    /**
     * метод устанавливает owner_id путешествия
     * @method
     * @name Travel.setOwnerID
     * @param {string} owner_id owner_id путешествия
     * @returns {Travel}
     */
    setOwnerID(owner_id){
        if (typeof owner_id === 'string' && owner_id.length > 0) {
            this._modified.owner_id = owner_id
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает значение code
     * @get
     * @name Travel.code
     * @returns {string}
     */
    get code(){
        return this._modified.code
    }

    /**
     * метод устанавливает code путешествия
     * @method
     * @name Travel.setCode
     * @param {string} code code путешествия
     * @returns {Travel}
     */
    setCode(code){
        if (typeof code === 'string' && code.length > 0) {
            this._modified.code = code
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает значение photo
     * @get
     * @name Travel.photo
     * @returns {string}
     */
    get photo(){
        return this._modified.photo
    }

    /**
     * метод устанавливает photo путешествия
     * @method
     * @name Travel.setPhoto
     * @param {string} photo photo путешествия
     * @returns {Travel}
     */
    setPhoto(photo){
        if (typeof photo === 'string' && photo.length > 0) {
            this._modified.photo = photo
            this.change = true
        }
        return this
    }

    /**
     * геттер возврпщпет знасение поля date_start
     * @get
     * @name Travel.date_start
     * @returns {string}
     */
    get date_start(){
        return this._modified.date_start
    }

    /**
     * установка поля date_start
     * @method
     * @name Travel.setDateStart
     * @param {Date | string} date дата начала путешествия
     * @returns {Travel}
     */
    setDateStart(date){
        const d = new Date(date)
        if(!Number.isNaN(d.getTime())){
            this._modified.date_start = d.toISOString()
        }
        return this
    }

    /**
     * геттер возврпщпет знасение поля date_end
     * @get
     * @name Travel.date_end
     * @returns {string}
     */
    get date_end(){
        return this._modified.date_end
    }

    /**
     * установка поля date_end
     * @method
     * @name Travel.setDateEnd
     * @param {Date | string} date дата конца путешествия
     * @returns {Travel}
     */
    setDateEnd(date){
        const d = new Date(date)
        if(!Number.isNaN(d.getTime())){
            this._modified.date_end = d.toISOString()
        }
        return this
    }

    /**
     * геттер возврпщпет знасение поля updated_at
     * @get
     * @name Travel.updated_at
     * @returns {Date}
     */
    get updated_at(){
        return this._modified.updated_at
    }

    /**
     * установка поля updated_at
     * @method
     * @name Travel.setUpdatedAt
     * @param {Date | string} date дата обновления путешествия
     * @returns {Travel}
     */
    setUpdatedAt(date){
        const d = new Date(date)
        if(!Number.isNaN(d.getTime())){
            this._modified.updated_at = d.toISOString()
        }
        return this
    }

    /**
     * геттер возврпщпет знасение поля created_at
     * @get
     * @name Travel.created_at
     * @returns {Date}
     */
    get created_at(){
        return this._modified.created_at
    }

    /**
     * установка поля created_at
     * @method
     * @name Travel.setCreatedAt
     * @param {Date | string} date дата обновления путешествия
     * @returns {Travel}
     */
    setCreatedAt(date){
        const d = new Date(date)
        if(!Number.isNaN(d.getTime())){
            this._modified.created_at = d.toISOString()
        }
        return this
    }

    /**
     * геттер возврпщпет знасение поля isPublic
     * @get
     * @name Travel.isPublic
     * @returns {DBFlagType}
     */
    get isPublic(){
        return this._modified.isPublic
    }

    /**
     * установка поля isPublic
     * @method
     * @name Travel.setIsPublic
     * @param {DBFlagType} flag флаг видимости путешествия
     * @returns {Travel}
     */
    setIsPublic(flag){
        if(typeof flag === 'number' && (flag === 1 || flag === 0)){
            this._modified.isPublic = flag
            this.change = true
        }
        return this
    }

    /**
     * геттер поля childs_count
     * @method
     * @name Travel.childs_count
     * @returns {number}
     */
    get childs_count() {
        return this._modified.childs_count
    }

    /**
     * установка поля childs_count
     * @method
     * @name Travel.setChildsCount
     * @param {number} value число детей в путешествии
     * @returns {Travel}
     */
    setChildsCount(value){
        if(typeof value === 'number' && value >= 0){
            this._modified.childs_count = value
            this.change = true
        }
        return this
    }

    /**
     * геттер поля adults_count
     * @method
     * @name Travel.adults_count
     * @returns {number}
     */
    get adults_count() {
        return this._modified.adults_count
    }

    /**
     * установка поля adults_count
     * @method
     * @name Travel.setAdultsCount
     * @param {number} value число взрослых в путешествии
     * @returns {Travel}
     */
    setAdultsCount(value){
        if(typeof value === 'number' && value >= 0){
            this._modified.adults_count = value
            this.change = true
        }
        return this
    }


    /**
     * геттер возвращает список movementTypes
     * @get
     * @name Travel.movementTypes
     * @returns {MovementType[]}
     */
    get movementTypes() {
        return [...this._modified.movementTypes]
    }

    /**
     * добавление способа перемещения
     * @method
     * @name Travel.addMovementType
     * @param {MovementType} item способ перемещения
     * @returns {Travel}
     */
    addMovementType(item){
        if(item){
            this._modified.movementTypes.push(item)
            this.change = true
        }
        return this
    }

    /**
     * устонавливаетспособы перемещения
     * @method
     * @name Travel.addMovementType
     * @param {MovementType[]} items способ перемещения
     * @returns {Travel}
     */
    setMovementTypes(items){
        if(Array.isArray(items)){
            this._modified.movementTypes = [...items]
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает список waypoints
     * @get
     * @name Travel.waypoints
     * @returns {InputPoint[]}
     */
    get waypoints() {
        return [...this._modified.waypoints]
    }

    /**
     * добавление способа перемещения
     * @method
     * @name Travel.addWaypoint
     * @param {InputPoint} item посещаемое место
     * @returns {Travel}
     */
    addWaypoint(item){
        if(item){
            this._modified.waypoints.push(item)
            this.change = true
        }
        return this
    }

    /**
     * устонавливает посещаемые места
     * @method
     * @name Travel.setWaypoints
     * @param {InputPoint[]} items посещаемые места
     * @returns {Travel}
     */
    setWaypoints(items){
        if(Array.isArray(items)){
            this._modified.waypoints = [...items]
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает список members
     * @get
     * @name Travel.members
     * @returns {MemberType[]}
     */
    get members() {
        return [...this._modified.members]
    }

    /**
     * добавление участника путешествия
     * @method
     * @name Travel.addMember
     * @param {MemberType} item посещаемое место
     * @returns {Travel}
     */
    addMember(item){
        if(item){
            this._modified.members.push(item)
            this.change = true
        }
        return this
    }

    /**
     * добавление участников путешествия
     * @method
     * @name Travel.setMembers
     * @param {MemberType[]} items посещаемое место
     * @returns {Travel}
     */
    setMembers(items){
        if(Array.isArray(items)){
            this._modified.members = [...items]
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает список hotels
     * @get
     * @name Travel.hotels
     * @returns {HotelType[]}
     */
    get hotels() {
        return [...this._modified.hotels]
    }

    /**
     * добавление отеля
     * @method
     * @name Travel.addHotel
     * @param {HotelType} item добавляемый отель
     * @returns {Travel}
     */
    addHotel(item){
        if(item){
            this._modified.hotels.push(item)
            this.change = true
        }
        return this
    }

    /**
     * добавление отелей
     * @method
     * @name Travel.setHotels
     * @param {HotelType[]} items добавляемый отель
     * @returns {Travel}
     */
    setHotels(items){
        if(Array.isArray(items)){
            this._modified.hotels = [...items]
            this.change = true
        }
        return this
    }

    /**
     * геттер возвращает список appointments
     * @get
     * @name Travel.appointments
     * @returns {AppointmentType[]}
     */
    get appointments() {
        return [...this._modified.appointments]
    }

    /**
     * добавление встречи
     * @method
     * @name Travel.addAppointment
     * @param {AppointmentType} item добавляемый отель
     * @returns {Travel}
     */
    addAppointment(item){
        if(item){
            this._modified.appointments.push(item)
            this.change = true
        }
        return this
    }

    /**
     * добавление встреч
     * @method
     * @name Travel.setAppointments
     * @param {AppointmentType[]} items добавляемый отель
     * @returns {Travel}
     */
    setAppointments(items){
        if(Array.isArray(items)){
            this._modified.appointments = [...items]
            this.change = true
        }
        return this
    }

    /**
     * метод устанавливает id пользователя, который редактирует путешествие,
     * в дальнейшем при сохранении / изменении в бд записи об этом лимите, будет использоваться данный лимит
     * @method
     * @name Travel.setUser
     * @param {string} user_id id пользователя, который редактирует путешествие
     * @returns {Limit}
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
     * @name Travel.save
     * @param {string} user_id id пользователя, который редактирует запись о путешествие
     * @returns {Promise<Travel>}
     */
    async save(user_id){
        const userOK = typeof user_id === 'string' && user_id.length > 0

        if(this.change){
            this.newTravel
                ? await travel_service.create(this._modified, userOK ? user_id : this.user_id)
                : await travel_service.update(this._modified, userOK ? user_id : this.user_id)
        }
        return this
    }

    /**
     * метод реализует удаление заприси о путешествии из бд
     * @method
     * @name Travel.delete
     * @param user_id id пользователя, который удаляет путешествие
     * @returns {Promise<Travel>}
     */
    async delete(user_id) {
        const userOK = typeof user_id === 'string' && user_id.length > 0

        if (userOK || this.user_id) {
            await travel_service.delete(this._modified, userOK ? user_id : this.user_id)
        }
        return this
    }

    toString(){
        return JSON.stringify(this._modified)
    }
}