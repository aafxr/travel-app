/**
 * @typedef RouteOptions
 * @property {PlaceType[]} places
 * @property {TimeHelper} timeHelper
 * @property {Date} travelStart
 * @property {number} defaultTime
 */
import LinkedList from "../utils/data-structures/LinkedList";
import {ENTITY} from "../static/constants";
import {nanoid} from "nanoid";
import getDistanceFromTwoPoints from "../utils/getDistanceFromTwoPoints";

/**
 * @class
 * @name Route
 *
 *
 * @param {RouteOptions} options
 * @constructor
 */
export default class Route {
    /**@type{LinkedList}*/
    list

    /**
     * @param {RouteOptions} options
     * @constructor
     */
    constructor({
                    places = [],
                    timeHelper,
                    travelStart,
                    defaultTime
                }) {
        this.list = new LinkedList(this.compare)
        this.timeHelper = timeHelper
        this.travelStart = travelStart
        this.defaultTime = defaultTime

        places.forEach(p => this.list.insert(p))

        let prevTime, idx = 0
        const iterator = this.iterator()
        let place = iterator.next().value
        while (place) {
            const nextPLace = iterator.next().value
            let duration = place.time_end - place.time_start
            if (duration <= 0) duration = this.defaultTime
            if (!prevTime) {
                place.time_start = new Date(this.travelStart)
                place.time_end = new Date(place.time_start)
                this.timeHelper.shift(place.time_end, duration)
                prevTime = new Date(place.time_end)
            } else {
                /**@type{MovingType}*/
                const moving = {
                    id: nanoid(7),
                    type: ENTITY.MOVING,
                    from: place.coords,
                    to: nextPLace.coords,
                    duration:0,
                    distance: 0,
                    start: new Date(prevTime),
                    end: new Date(prevTime)
                }

                moving.distance = getDistanceFromTwoPoints(moving.from, moving.to)
                // moving.duration
            }
        }
    }

    /**
     * @param {HotelType | PlaceType} a
     * @param {HotelType | PlaceType} b
     */
    compare(a, b) {
        let start_a
        let start_b

        if (a.type === ENTITY.HOTEL)
            start_a = a.check_in
        else if (a.type === ENTITY.PLACE)
            start_a = a.time_start

        if (b.type === ENTITY.HOTEL)
            start_b = b.check_in
        else if (b.type === ENTITY.PLACE)
            start_b = b.time_start

        if (!start_b) return 1
        if (!start_a) return 1

        return start_a - start_b
    }

    /** @return {{next(): {value: (PlaceType|undefined), done: boolean}}} */
    iterator() {
        return this[Symbol.iterator]()
    }

    /** @return {{next(): ({value: undefined | PlaceType, done: boolean})}} */
    [Symbol.iterator]() {
        let node = this.list.head
        return {
            next() {
                if (node && node.value) {
                    const value = node.value
                    node = node.next
                    return {value, done: false}
                } else
                    return {done: true, value: undefined}
            }
        }
    }
}