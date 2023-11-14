import {MS_IN_DAY} from "../static/constants";

/**
 * @typedef RouteBuilderOptionsType
 * @property {Travel} travel
 * @property {HotelType[]} hotels
 * @property {PlaceType[]} places
 * @property {PointType[]} waypoints
 * @property {AppointmentType[]} appointments
 */
export default class RouteBuilder {
    /**@type{number}*/
    _date_start

    /**@type{number}*/
    _date_end

    /** @type{Map<number, PlaceType[]>}*/
    placesMap

    /**@param {RouteBuilderOptionsType} options*/
    constructor(options) {
        const {hotels, places, waypoints, appointments, travel} = options

        this._travel = travel
        this.hotels = hotels
        this.appoinments = appointments
        this.places = places
        this.waypoints = waypoints

        this.placesMap = new Map()

        this.updateRoute()
    }

    /**
     * метод выполняет пересчет маршрута
     * @method
     * @name RouteBuilder.updateRoute
     */
    updateRoute() {
        this.placesMap.clear()
        if (!this._travel.places.length) return
        let range = {start: Number.POSITIVE_INFINITY, end: Number.NEGATIVE_INFINITY}

        this._travel.places.reduce((acc, p) => {
            let dateStart = new Date(p.date_start).getTime()
            dateStart -= dateStart % MS_IN_DAY
            let dateEnd = new Date(p.date_end).getTime()
            dateEnd -= dateEnd % MS_IN_DAY
            if (!Number.isNaN(dateStart) && acc.start > dateStart) {
                acc.start = dateStart
            }
            if (!Number.isNaN(dateEnd) && acc.end < dateEnd) {
                acc.end = dateEnd
            }
            return acc
        }, range)

        this._date_start = range.start
        this._date_end = range.end

        let days = (range.end - range.start) / MS_IN_DAY
        days = Math.floor(Math.max(1, days))

        for (let i = 1; i <= days; i++) {
            this.placesMap.set(i, [])
        }

        this._travel.places.forEach(p => {
            let start = new Date(p.date_start).getTime()
            start -= start % MS_IN_DAY
            let end = new Date(p.date_end).getTime()
            end -= end % MS_IN_DAY
            let daysCount = (start - end) / MS_IN_DAY
            daysCount = Math.max(Math.ceil(daysCount), 1)

            let startDay = Math.floor((this._date_start - start) / MS_IN_DAY)
            startDay = Math.max(startDay, 1)
            if (!Number.isNaN(daysCount)) {
                for (let i = startDay + 1; i <= startDay + daysCount + 1; i++) {
                    if (!this.placesMap.has(i)) this.placesMap.set(i, [])
                    this.placesMap.get(i).push(p)
                }
            }
        })
    }


    /**
     * Меьод возвращает сгруппированный спиок мест по дням
     * @method
     * @name RouteBuilder.getRouteByDay
     * @param {number} i
     * @returns {PlaceType[]}
     */
    getRouteByDay(i) {
        return this.placesMap.get(i) || []
    }

    /**
     * возвращает список дней с активностями
     * @method
     * @name RouteBuilder.getActivityDays
     * @returns {number[]}
     */
    getActivityDays(){
        console.log(this)
        console.log(this.placesMap)
        return Array.from(this.placesMap.keys()).filter((key) => this.placesMap.get(key).length > 0)

    }
    /**
     * @get
     * @name RouteBuilder.days
     * @returns {number}
     */
    get days() {
        let days = (this._date_end - this._date_start) / MS_IN_DAY
        return Math.max(Math.ceil(days), 1)
    }
}
