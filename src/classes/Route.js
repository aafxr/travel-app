/**
 * @typedef RouteOptions
 * @property {HotelType[]} hotels
 * @property {PlaceType[]} places
 * @property {TimeHelper} timeHelper
 */
import LinkedList from "../utils/data-structures/LinkedList";
import {ENTITY} from "../static/constants";

/**
 * @class
 * @name Route
 *
 *
 */
export default class Route {
    /**@type{LinkedList}*/
    list

    /**
     * @param {RouteOptions} options
     * @constructor
     */
    constructor({
                    hotels = [],
                    places = [],
                    timeHelper
                }) {
        this.list = new LinkedList(this.compare)
        this.timeHelper = timeHelper

        hotels.forEach(h => this.list.insert(h))
        places.forEach(p => this.list.insert(p))
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
        else if(a.type === ENTITY.PLACE)
            start_a = a.time_start

        if (b.type === ENTITY.HOTEL)
            start_b = b.check_in
        else if(b.type === ENTITY.PLACE)
            start_b = b.time_start

        if(!start_b) return 1
        if (!start_a) return 1

        return  start_a - start_b
    }

    [Symbol.iterator](){
        let node = this.list.head
        return {
            next(){
                if (node && node.value) {
                    const value = node.value
                    node = node.next
                    return {value, done: false}
                }else
                    return {done: true}
            }
        }
    }
}