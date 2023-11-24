import getDistanceFromTwoPoints from "../utils/getDistanceFromTwoPoints";
import bfTravellingSalesman from "../utils/sort/bfTravellingSalesman";
import GraphVertex from "../utils/data-structures/GraphVertex";
import GraphEdge from "../utils/data-structures/GraphEdge";
import Graph from "../utils/data-structures/Graph";
import {MS_IN_DAY} from "../static/constants";
import randomNumber from "../utils/randomNumber";
import PlaceActivity from "./PlaceActivity";
import RoadActivity from "./RoadActivity";


/**
 * @typedef SortPointType
 * @property {string} id
 * @property {CoordinatesType} coords
 * @property {string} start_time date format iso string
 * @property {string} end_time date format iso string
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
    _time_start

    /**@type{number}*/
    _time_end

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
     * @apram {PlaceType} places
     */
    updateRoute(places) {
        this.placesMap.clear()
        // if (!this._travel.places.length) return
        // let range = {start: Number.POSITIVE_INFINITY, end: Number.NEGATIVE_INFINITY}

        // this._travel.places.reduce((acc, p) => {
        //     let dateStart = new Date(p.time_start).getTime()
        //     dateStart -= dateStart % MS_IN_DAY
        //     let dateEnd = new Date(p.time_end).getTime()
        //     dateEnd -= dateEnd % MS_IN_DAY
        //     if (!Number.isNaN(dateStart) && acc.start > dateStart) {
        //         acc.start = dateStart
        //     }
        //     if (!Number.isNaN(dateEnd) && acc.end < dateEnd) {
        //         acc.end = dateEnd
        //     }
        //     return acc
        // }, range)
        //
        // this._time_start = range.start
        // this._time_end = range.end
        //
        // let days = (range.end - range.start) / MS_IN_DAY
        // days = Math.floor(Math.max(1, days))
        //
        // for (let i = 1; i <= days; i++) {
        //     this.placesMap.set(i, [])
        // }
        //
        // this._travel.places.forEach(p => {
        //     let start = new Date(p.time_start).getTime()
        //     start -= start % MS_IN_DAY
        //     let end = new Date(p.time_end).getTime()
        //     end -= end % MS_IN_DAY
        //     let daysCount = (start - end) / MS_IN_DAY
        //     daysCount = Math.max(Math.ceil(daysCount), 1)
        //
        //     let startDay = Math.floor((this._time_start - start) / MS_IN_DAY)
        //     startDay = Math.max(startDay, 1)
        //     if (!Number.isNaN(daysCount)) {
        //         for (let i = startDay + 1; i <= startDay + daysCount + 1; i++) {
        //             if (!this.placesMap.has(i)) this.placesMap.set(i, [])
        //             this.placesMap.get(i).push(p)
        //         }
        //     }
        // })


        if(!this._travel.places.length) return
        this._travel._places = this.sortByGeneticAlgorithm(places)
        const activities = this._travel.places.map(p => new PlaceActivity({
            place: p,
            defaultActivitySpentTime: 1.5 * 60 * 60 * 1000,
            travel_start_time: new Date(this._travel.date_start)
        }))

        for (let i = 0; i < activities.length -1 ; i++) {
            new RoadActivity({
                to:activities[i+1],
                from: activities[i],
                travel_start_time: new Date(this._travel.date_start),
                defaultActivitySpentTime: 1.5 * 60 * 60 * 1000
            })
        }
        console.log(activities)
        activities[0].shiftTimeBy()
        activities[0].log()

    }


    /**
     * @param startFrom
     * @param {any[]} array
     * @returns {any[]}
     * @private
     */
    _shuffle(startFrom, array) {
        const arr = array.filter(el => el !== startFrom)

        let currentIndex = arr.length, randomIndex;

        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
        }
        return [startFrom, ...arr];
    }

    /**
     * метод решает задачу коммивояжёра ( travelling salesman problem) —
     * цель задачи заключающаяся в поиске самого выгодного маршрута,
     * проходящего через указанные города по одному разу
     * @method
     * @name RouteBuilder.sortPlacesByDistance
     * @param {SortPointType[]} points список точек для сортировки
     * @param {number} [maxDist] радиус поиска точек
     * @param {(point_1: CoordinatesType, point_2: CoordinatesType) => number} [distanceCB] callback, возвращает число, которое будет использоваться как вес ребра
     * @returns {SortPointType[]}
     */
    sortPlacesByDistance(points, maxDist, distanceCB = getDistanceFromTwoPoints) {
        if (points.length === 0) return points

        const pointGroupes = this._groupPoints(points, maxDist)
        /**@type{Map<string, SortPointType[]>}*/
        const groupesMap = new Map()
        /**@type{SortPointType[]}*/
        const majorPointsToSort = []
        /**@type{SortPointType[]}*/
        const resulPointsArr = []

        pointGroupes.forEach(gp => {
            if (gp.length) {
                groupesMap.set(gp[0].id, gp)
                majorPointsToSort.push(gp[0])
            }
        })

        let idx = 0
        const MAX_SORT_ELEMENTS = 9

        while (idx < majorPointsToSort.length) {
            let temp = majorPointsToSort.slice(idx, idx + MAX_SORT_ELEMENTS)
            idx += temp.length

            const graph = this._prepareData(temp, distanceCB)

            /**@type{SortPointType[]}*/
            temp = bfTravellingSalesman(graph)
                .map(/**@param {GraphVertex} gv*/gv => temp.find(tp => tp.id === gv.getKey()))

            temp.forEach(tp => {
                resulPointsArr.push(...groupesMap.get(tp.id))
                groupesMap.delete(tp.id)
            })
        }

        resulPointsArr.forEach(p => {
            p.location = {};
            p.location.lat = p.coords[0];
            p.location.lng = p.coords[1];
        })

        return resulPointsArr
    }

    /**
     * @param {SortPointType[]} points
     * @param {number} mutation  0 - 100, вероятность мутации
     * @param {number} cycles количество циклов
     * @returns {*[]}
     */
    sortByGeneticAlgorithm(points, mutation = 100, cycles = 500) {
        const start = new Date()
        if (!points || !points.length) return []

        const graph = this._prepareData(points)
        const verteces = graph.getAllVertices()
        const startVertex = verteces[0]
        /**@type{Map<GraphVertex[], number>}*/
        const populationMap = new Map()
        let population =
            Array
                .from({length: Math.min(500, points.length * 10)})
                .fill(0)
                .map(() => this._shuffle(startVertex, [...verteces]))
        const MAX_POPULATION_SIZE = population.length

        population.forEach(p => {
            const dist = this._pathLength(graph, p)
            populationMap.set(p, dist)
        })

        let maxDist = Math.max(...populationMap.values())
        let shortest = [...shortestPath(populationMap)]

        /**
         * @param {Map<GraphVertex[],number>} map
         * @return {GraphVertex[]}
         */
        function shortestPath(map) {
            let shortestPath
            let dist = Number.MAX_SAFE_INTEGER
            for (const [v, d] of map.entries()) {
                if (!shortestPath) {
                    shortestPath = v
                    dist = d
                    continue
                }
                if (d < dist) {
                    shortestPath = v
                    dist = d
                }
            }
            return shortestPath
        }

        /**
         * @param {GraphVertex[]} parent_1
         * @param {GraphVertex[]} parent_2
         */
        function generateChild(parent_1, parent_2) {
            let split_idx = Math.floor(Math.random() * parent_1.length)
            const result = parent_1.slice(0, split_idx + 1)
            parent_2.slice(0, split_idx + 1)
                .forEach(v => !result.includes(v) && result.push(v))
            parent_1.slice(split_idx + 1, parent_1.length)
                .forEach(v => !result.includes(v) && result.push(v))
            parent_2.slice(split_idx + 1, parent_2.length)
                .forEach(v => !result.includes(v) && result.push(v))
            const r_idx = result.indexOf(parent_1[parent_1.length - 1]);
            [result[r_idx], result[result.length - 1]] = [result[result.length - 1], result[r_idx]]
            return result
        }

        /**
         * @param {GraphVertex[]} child
         */
        function mutateChild(child) {
            // меняются местами рандомные две точки кроме 1 и последней
            const first_idx = randomNumber(1, child.length - 2, [0, child.length - 1])
            const second_idx = randomNumber(1, child.length - 2, [0, first_idx, child.length - 1]);
            [child[first_idx], child[second_idx]] = [child[second_idx], child[first_idx]]
        }

        for (let cycle_idx = 0; cycle_idx < cycles; cycle_idx += 1) {
            if (populationMap.size > MAX_POPULATION_SIZE * 2) {
                let list = Array
                    .from(populationMap.entries())
                    .sort((a, b) => a[1] - b[1])

                let idx = 0
                while (idx < list.length) {
                    if (list[idx][1] > maxDist) break
                    idx += 1
                }

                list = list.slice(0, Math.min(MAX_POPULATION_SIZE * 2, idx))

                populationMap.clear()
                list.forEach(l => populationMap.set(...l))
                maxDist = Math.max(...populationMap.values())
                // console.log(populationMap)
            }

            if (!population.length) break

            for (let j = 0; j < population.length; j += 2) {
                const isMutate = Math.random() * 100 < mutation
                if (population[j] && !population[j + 1]) {
                    if (isMutate) mutateChild(population[j])
                    populationMap.set(population[j], this._pathLength(graph, population[j]))
                    continue
                }
                const ch1 = generateChild(population[j], population[j + 1])
                const ch2 = generateChild(population[j + 1], population[j])
                if (isMutate && ch1.length > 4) {
                    mutateChild(ch1)
                    mutateChild(ch2)
                }
                const pathLength1 = this._pathLength(graph, ch1)
                const pathLength2 = this._pathLength(graph, ch2)
                pathLength1 < maxDist && populationMap.set(ch1, pathLength1)
                pathLength2 < maxDist && populationMap.set(ch2, pathLength2)
            }


            for (const [v, d] of populationMap.entries()) {
                if (d > maxDist) populationMap.delete(v)
            }

            // console.log(populationMap.size, maxDist)
            if (populationMap.size < 2) break

            maxDist = Math.max(...populationMap.values())
            shortest = [...shortestPath(populationMap)]
            population = [...populationMap.keys()]
        }


        console.log('Shortest route length: ', this._pathLength(graph, shortest))

        shortest = shortest.map(vp => this.placeMap.get(vp.getKey()))

        shortest.forEach(p => {
            p.location = {};
            p.location.lat = p.coords[0];
            p.location.lng = p.coords[1];
        })

        return shortest
    }

    /**
     * @param {Graph} graph
     * @param {GraphVertex[]} vertices
     * @return {number}
     * @private
     */
    _pathLength(graph, vertices) {
        if (!vertices || vertices.length < 2) return 0

        let result = 0
        for (let i = 0; i < vertices.length - 1; i += 1) {
            const edge = graph.findEdge(vertices[i], vertices[i + 1])
            if (edge) result += edge.weight
        }
        return result
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
     *
     * @param {SortPointType[]} points
     * @param {number} [maxDist] default = 30
     * @return {SortPointType[][]}
     * @private
     */
    _groupPoints(points, maxDist = 30) {
        if (!points || !points.length) return []
        /**@type{Map<SortPointType, SortPointType[]>}*/
        const groups = new Map()

        for (const point of points) {
            let isAdd = false
            if (groups.size === 0) {
                groups.set(point, [point])
                continue
            }

            for (const group_point of groups.keys()) {
                if (getDistanceFromTwoPoints(group_point.coords, point.coords) <= maxDist) {
                    groups.get(group_point).push(point)
                    isAdd = true
                    break
                }
            }
            if (!isAdd) groups.set(point, [point])
        }

        return Array.from(groups.values())
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
        let days = (this._time_end - this._time_start) / MS_IN_DAY
        return Math.max(Math.ceil(days), 1)
    }


}
