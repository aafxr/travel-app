import bfTravellingSalesman from "../utils/sort/bfTravellingSalesman";
import GraphVertex from "../utils/data-structures/GraphVertex";
import GraphEdge from "../utils/data-structures/GraphEdge";
import Graph from "../utils/data-structures/Graph";
import {MS_IN_DAY} from "../static/constants";
import dijkstra from "../utils/sort/dijkstra";
import getDistanceFromTwoPoints from "../utils/getDistanceFromTwoPoints";
import bellmanFord from "../utils/sort/bellmanFord";
import hamiltonianCycle from "../utils/sort/hamiltonianCycle";
import floydWarshall from "../utils/sort/floydWarshall";
import PriorityQueue from "../utils/data-structures/PriorityQueue";

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
     * @param {SortPointType[]} placesList список точек для сортировки
     * @param {(point_1: CoordinatesType, point_2: CoordinatesType) => number} [distanceCB] callback, возвращает число, которое будет использоваться как вес ребра
     * @returns {SortPointType[]}
     */
    sortPlacesByDistance(placesList, distanceCB = getDistanceFromTwoPoints) {
        if (placesList.length === 0) return placesList

        const list = []
        /**@type{Map<string, SortPointType>}*/
        const placeMap = new Map()
        /**@type{Map<string, GraphVertex>}*/
        const vertexMap = new Map()
        /**@type{GraphEdge[]}*/
        const edges = []
        /**@type{Graph}*/
        const graph = new Graph(true)

        placesList.forEach(p => {
            list.push(p.id)
            placeMap.set(p.id, p)
            vertexMap.set(p.id, new GraphVertex(p.id))
        })
        for (const place_id of list) {
            for (const vertex_key of vertexMap.keys()) {
                if (place_id === vertex_key) continue

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
     * @param {SortPointType[]} points
     * @param {(point_1: CoordinatesType, point_2: CoordinatesType) => number} [distanceCB] callback, возвращает число, которое будет использоваться как вес ребра
     * @return {Graph}
     * @private
     */
    _prepareData(points, distanceCB = getDistanceFromTwoPoints) {
        this.id_list = []
        /**@type{Map<string, SortPointType>}*/
        this.placeMap = new Map()
        /**@type{Map<string, GraphVertex>}*/
        this.vertexMap = new Map()
        /**@type{GraphEdge[]}*/
        this.edges = []
        /**@type{Graph}*/
        const graph = new Graph(true)


        points.forEach(p => {
            this.id_list.push(p.id)
            this.placeMap.set(p.id, p)
            const vertex = new GraphVertex(p.id)
            this.vertexMap.set(p.id, vertex)
        })
        for (const place_id of this.id_list) {
            for (const vertex_key of this.vertexMap.keys()) {
                if (place_id === vertex_key) continue

                const coord_1 = this.placeMap.get(place_id).coords
                const coord_2 = this.placeMap.get(vertex_key).coords

                const e = new GraphEdge(
                    this.vertexMap.get(place_id),
                    this.vertexMap.get(vertex_key),
                    distanceCB(coord_1, coord_2)
                )
                this.edges.push(e)
            }
        }

        this.edges.forEach(e => graph.addEdge(e))
        return graph
    }

    /**
     * @typedef SortPointType
     * @property {string} id
     * @property {CoordinatesType} coords
     * @property {string} start_time date format iso string
     * @property {string} end_time date format iso string
     */

    /**
     * @param {SortPointType[]} points
     * @param {(point_1: CoordinatesType, point_2: CoordinatesType) => number} [distanceCB] callback, возвращает число, которое будет использоваться как вес ребра
     */
    sortDijkstra(points, distanceCB = getDistanceFromTwoPoints) {
        const graph = this._prepareData(points, distanceCB)
        const startVertex = graph.getAllVertices()[0]

        const res = dijkstra(graph, startVertex)

        console.log(res)
        window.result = res
    }

    sortBellmanFord(points, distanceCB = getDistanceFromTwoPoints) {
        const graph = this._prepareData(points, distanceCB)
        const startVertex = graph.getAllVertices()[0]

        const res = bellmanFord(graph, startVertex)

        console.log(res)
        window.result = res
    }

    sortHamiltonianCycle(points, distanceCB = getDistanceFromTwoPoints) {
        const graph = this._prepareData(points, distanceCB)
        const startVertex = graph.getAllVertices()[0]

        const res = hamiltonianCycle(graph)

        console.log(res)
        window.result = res
    }

    sortFloydWarshall(points, distanceCB = getDistanceFromTwoPoints) {
        const graph = this._prepareData(points, distanceCB)
        const startVertex = graph.getAllVertices()[0]

        const res = floydWarshall(graph)


        console.log(res)
        window.result = res
    }

    /**
     * @typedef CombinePointsOptionsType
     * @property {SortPointType[]} points список мест для посещения
     * @property {(point_1: CoordinatesType, point_2: CoordinatesType) => number} [distanceCB] callback, расчитывает растояние между точками
     * @property {number} [sightseeingTime] default = 45min, глубина осмотра дочтопримечательностей
     */

    /**
     * @param {CombinePointsOptionsType} options
     */
    combinePoints({points, distanceCB = getDistanceFromTwoPoints, sightseeingTime = 45}) {
        const distances = {}
        const pointsMap = {}
        for (const point_a of points) {
            pointsMap[point_a.id] = point_a
            for (const point_b of points) {
                const id_a = point_a.id
                const id_b = point_b.id

                if (point_a === point_b) continue
                if (distances[id_a + '-' + id_b] || distances[id_b + '-' + id_a]) continue

                distances[id_a + '-' + id_b] = distanceCB(point_a.coords, point_b.coords)
            }
        }

        const priorityQueue = new PriorityQueue()
        for (let i = 0; i < distancesKeys.length; i++) {
            const priority = distancesKeys.length - i
            distancesMap.get(distancesKeys[i]).forEach(p => priorityQueue.add(p, priority))
        }

        console.log(priorityQueue.toString())
        window.result = distances

        return {
            distances, priorityQueue
        }
    }

    /**
     *
     * @param {SortPointType[]} points
     * @param {number} [maxDist] default = 30
     * @param {Set<SortPointType>} [pointsSet]
     * @return {SortPointType[][]}
     * @private
     */
    _groupPoints(points, maxDist = 30, pointsSet) {
        if (!points || points.length) return []
        if (!pointsSet) {
            pointsSet = new Set(points)
        }
        const currentPoint = points[0]
        const closestPoints = [currentPoint]
        pointsSet.delete(closestPoints)

        for (const point of points) {
            if (currentPoint === point) continue
            if (getDistanceFromTwoPoints(currentPoint.coords, point.coords) < maxDist) {
                closestPoints.push(point)
                pointsSet.delete(point)
            }
        }

        return pointsSet.size
            ? [currentPoint, ...this._groupPoints([...pointsSet], maxDist, pointsSet)]
            : [currentPoint]
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
    getActivityDays() {
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

// const result = {
//     distances: {}
// }
//
//
// const points = Array.from({length: 20}).fill(0).map((_, idx) => ({
//     id: (idx + 1).toString(),
//     coords: [
//         50 + Math.random() * 2,
//         50 + Math.random() * 2
//     ]
// }))
//
// const distanceMap = new Map([
//     [10, []],
//     [20, []],
//     [30, []],
//     [40, []],
//     [50, []],
//     [60, []],
//     [-1, []],
// ])
//
// Object.keys(result.distances).forEach(key => {
//     if (result.distances[key] === 0)
//         return
//     else if (result.distances[key] <= 10)
//         distanceMap.get(10).push(key)
//     else if (result.distances[key] <= 20)
//         distanceMap.get(20).push(key)
//     else if (result.distances[key] <= 30)
//         distanceMap.get(30).push(key)
//     else if (result.distances[key] <= 40)
//         distanceMap.get(40).push(key)
//     else if (result.distances[key] <= 50)
//         distanceMap.get(50).push(key)
//     else if (result.distances[key] <= 60)
//         distanceMap.get(60).push(key)
//     else
//         distanceMap.get(-1).push(key)
// })