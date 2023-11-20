import {MS_IN_DAY} from "../static/constants";
import GraphVertex from "../utils/data-structures/GraphVertex";
import GraphEdge from "../utils/data-structures/GraphEdge";
import Graph from "../utils/data-structures/Graph";
import bfTravellingSalesman from "../utils/sort/bfTravellingSalesman";

/**
 * @typedef SalesmanItemType
 * @property {string} id
 * @property {CoordinatesType} coords
 */

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
     * метод решает задачу коммивояжёра ( travelling salesman problem) —
     * цель задачи заключающаяся в поиске самого выгодного маршрута,
     * проходящего через указанные города по одному разу
     * @method
     * @name RouteBuilder.sortPlacesByDistance
     * @param {any[]} placesList список точек для сортировки
     * @param {(item: any) => SalesmanItemType} transformCB callback, извлекает необходимые для алгоритма поля
     * @param {(point_1: CoordinatesType, point_2: CoordinatesType) => number} distanceCB callback, возвращает число, которое будет использоваться как вес ребра
     * @returns {any[]}
     */
    sortPlacesByDistance(placesList, transformCB ,distanceCB){
        if(!distanceCB) return {distance: 0, list: placesList}
        if(placesList.length === 0) return {distance: 0, list: placesList}

        const list = []
        /**@type{Map<string, PointType>}*/
        const placeMap  = new Map()
        /**@type{Map<string, GraphVertex>}*/
        const vertexMap  = new Map()
        /**@type{GraphEdge[]}*/
        const edges = []
        /**@type{Graph}*/
        const graph = new Graph(true)

        placesList.forEach(p => {
            list.push(p.id)
            placeMap.set(p.id, p)
            vertexMap.set(p.id, new GraphVertex(p.id))
        })
        for (const place_id of list){
            for (const vertex_key of vertexMap.keys()){
                if(place_id === vertex_key) continue

                const coord_1 = placeMap.get(place_id).coords
                const coord_2 = placeMap.get(vertex_key).coords

                const e = new GraphEdge(
                    vertexMap.get(place_id),
                    vertexMap.get(vertex_key),
                    distanceCB(coord_1, coord_2)
                )
                edges.push(e)
            }
        }

        edges.forEach(e => graph.addEdge(e))

        const res = bfTravellingSalesman(graph)

        const resultList = res.map(/**@param {GraphVertex} r*/r => placeMap.get(r.getKey()))

        return resultList
    }


    /**
     * Метод возвращает сгруппированный спиок мест по дням
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
