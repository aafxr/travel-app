/**
 * @typedef {IMapOptionsType} YMapOptionsType
 */

 /**
 * @typedef {IMapPointOptionsType} YMapPointOptionsType
 */


import defaultPoint from "../utils/default-values/defaultPoint";
import userLocation from "../utils/userLocation";
import IMap from "./IMap";
import getDistanceFromTwoPoints from "../utils/getDistanceFromTwoPoints";
import defaultHandleError from "../utils/error-handlers/defaultHandleError";

/**
 * #### Данный класс предполагается использовать когда скрипт карты уже загружен и готов к работе
 * ---
 * Данный класс предназначен для интерактива с картой
 * @class
 * @name YMap
 *
 *
 * @constructor
 * @param {YMapOptionsType} options
 */
export default class YMap extends IMap {
    /**@type{MapPointType[]}*/
    points = []
    _map
    /**@type{number}*/
    _zoom
    /**@type{CoordinatesType}*/
    _center
    /**@type{string}*/
    _container_id
    /**@type{Map<string, Object>}*/
    _pointsMap = new Map()

    _polyLine


    /** @param {YMapOptionsType} options */
    constructor(options) {
        super(options)
        this._travel = options.travel
        if (options.points) this.points = options.points

        this._onPointMoved = options.onPointMoved || (() => {
        })
        this._onPointClick = options.onPointClick || (() => {
        })
        this._onPointAdd = options.onPointAdd || (() => {
        })

        this._zoom = options.zoom || 7
        this._center = options.center || [55.02629924781924, 82.92193912995225]
        this._container_id = options.container_id || 'map'
        this._add_location_icon = options.add_location_icon || ''
        this._location_icon = options.location_icon || ''
        this._icon_size = options.icon_size || [32, 32]
    }

    /**
     * Метод выподняет настройку карты после очистки или при первой инициализации
     * @method
     * @name YMap._initializeMap
     * @private
     */
    _initializeMap() {
        if (this._map) {
            for (const placeMark of this._pointsMap.entries()) {
                this._map.geoObjects.add(placeMark)
            }
            if (this._polyLine) {
                this._map.geoObjects.add(this._polyLine)
            }
        }
    }

    /**
     * Возвращает кратчайшее (вдоль геодезической линии) расстояние между двумя заданными точками (в метрах).
     * @static
     * @name YMap.getDistance
     * @param {CoordinatesType} point_1
     * @param {CoordinatesType} point_2
     * @returns {number}
     */
    static getDistance(point_1, point_2) {
        if (point_1 && point_2) {
            return window.ymaps.coordSystem.geo.getDistance(point_1, point_2)
        } else {
            return 0
        }
    }

    /**
     * установка нового id контейнера карты
     * @method
     * @name YMap.setContainerID
     * @param {string} container_id
     * @returns {YMap}
     */
    setContainerID(container_id) {
        if (container_id) {
            this._container_id = container_id
            this._map = new window.ymaps.Map(this._container_id, {
                center: this._center,
                zoom: this._zoom
            }, {searchControlProvider: 'yandex#search'})
            this._initializeMap()
        }
        return this
    }

    /**
     * @method
     * @name YMap.newPoint
     * @returns {MapPointType}
     */
    newPoint() {
        return defaultPoint(this._travel.id)
    }

    /**
     * @method
     * @name YMap.clearMap
     * @returns {YMap}
     */
    clearMap() {

        this._map && this._map.geoObjects.removeAll()
        this._pointsMap.clear()
        this._polyLine = null
        return this
    }

    /**
     * @method
     * @name YMap.getZoom
     * @returns {number}
     */
    getZoom() {
        return this._zoom
    }

    /**
     * @method
     * @name YMap.setZoom
     * @param value
     * @returns {YMap}
     */
    setZoom(value) {
        if (!value) return this
        this._zoom = value
        this._map.setZoom(this._zoom, {smooth: true})
        return this
    }

    /**
     * метод пытается получить координаты средствами браузера или средствами yandex maps api
     * @method YMap.getUserLocation
     * @returns {Promise<[number, number]>}
     */
    getUserLocation() {
        return new Promise(async (resolve, reject) => {

            let coords
            try {
                coords = await userLocation()
            } catch (err) {
                defaultHandleError(err)
            }

            if (Array.isArray(coords)){
                resolve(coords)
            } else{
                window.ymaps.geolocation.get({
                    provider: 'yandex',
                    autoReverseGeocode: true
                }).then(function (result) {
                    const coords = result.geoObjects.get(0).geometry.getCoordinates()
                    resolve(coords)
                }).catch(reject)
            }
        })
    }

    destroyMap() {
        this._map && this._map.destroy()
    }

    /**
     * @method
     * @name YMap.addPoint
     * @param {MapPointType} point
     * @param {YMapPointOptionsType} [options]
     * @return {YMap}
     */
    addPoint(point, options = {}) {
        if (point) {
            const placemark = new window.ymaps.Placemark(point.coords, {
                hintContent: options.hintContent || '',
                balloonContent: options.balloonContent || '',
                iconContent: options.iconText
            }, {
                iconLayout: 'default#imageWithContent',
                iconImageHref: options.markerType === 'exist' ? this._location_icon : this._add_location_icon,
                iconImageSize: this._icon_size,
                iconImageOffset: [-this._icon_size[0] * 0.5, -this._icon_size[1]],
                iconContentOffset: [this._icon_size[0] * 0.5, this._icon_size[1] * 0.375],
                draggable: options.draggable ?? true,
                cursor: 'pointer',
                iconContentLayout: this._createIconContentLayout()
            })

            this._map.geoObjects.add(placemark)
            this._pointsMap.set(point.id, placemark)
        }
        return this
    }

    /**
     * поиск подходящих под переданный адресс мест. Возвращается массив найденных мест
     * @method
     * @name YMap.getPointByAddress
     * @param {string} address
     * @returns {Promise<GeoObjectPropertiesType[]>}
     */
    async getPointByAddress(address) {
        const geocoder = window.ymaps.geocode(address)
        return await geocoder
            .then(res => {
                window.res = res
                /** информация о найденом месте */
                /**@type{GeoObjectPropertiesType[]} */
                const geoObjects = []
                res.geoObjects.each(go => geoObjects.push(go.properties.getAll()))
                return geoObjects
            })
    }

    _createIconContentLayout(){
        return window.ymaps.templateLayoutFactory.createClass(
            '<div style="color: #FFFFFF; background-color: #FF8E09; font-size: 9px;transform: translate(-50%, -50%)">$[properties.iconContent]</div>'
        )
    }

    /** @typedef {MapPointType & Partial<BalloonOptionsType>} MapPointWithOptionsType*/
    /**
     * @method
     * @name YMap.showRoute
     * @param {MapPointWithOptionsType[]} points
     * @param {YMapOptionsType} routeName
     * @returns {YMap}
     */
    showRoute(points, routeName) {
        this.clearMap()

        for (let idx = 0; idx < points.length; idx += 1) {
            const point = points[idx]
            try {
                const placemark = new window.ymaps.Placemark(point.coords ? point.coords : point.location, {
                    hintContent: point.hintContent || '',
                    balloonContentHeader: point.balloonContentHeader || '',
                    balloonContentBody: point.balloonContentBody || '',
                    balloonContentFooter: point.balloonContentFooter || '',
                    iconContent: idx + 1
                }, {
                    iconLayout: 'default#imageWithContent',
                    iconImageHref:  this._location_icon,
                    iconImageSize: this._icon_size,
                    iconImageOffset: [-this._icon_size[0] * 0.5 , -this._icon_size[1]],
                    iconContentOffset: [this._icon_size[0] * 0.5, this._icon_size[1] * 0.375],
                    draggable: false,
                    cursor: 'pointer',
                    iconContentLayout: this._createIconContentLayout()
                })

                this._pointsMap.set(point.id, placemark)
                this._map.geoObjects.add(placemark)
            } catch (err) {
                console.error(err)
            }
        }

        this._polyLine = new window.ymaps.Polyline(points.map(p => p.coords ? p.coords : p.location), {
            balloonContent: routeName || ''
        }, {
            balloonCloseButton: false,
            strokeColor: "#FF8E09",
            strokeWidth: 4,
            strokeOpacity: 1,
        });

        this._map.geoObjects.add(this._polyLine)
        const bounds = this._map.geoObjects.getBounds()
        if (bounds) this._map.setBounds(bounds)
        this._map.setZoom(this._zoom, {smooth: true})

        return this
    }

    /**
     * @method
     * @name YMap.showPolyRoute
     * @param {[number, number][]} polylineDots
     * @param {BalloonOptionsType} [options]
     * @return {YMap}
     */
    showPolyRoute(polylineDots, options = {}) {
        if (!Array.isArray(polylineDots)) return this
        if (this._polyLine) this._map.geoObjects.remove(this._polyLine)

        let polyline = new window.ymaps.Polyline(polylineDots, {
            ...options
        }, {
            draggable: false,
            strokeColor: "#FF8E09",
            strokeWidth: 4,
        });

        this._map.geoObjects.add(polyline)
        this._polyLine = polyline
        return this
    }

    /**
     * метод добавляет балун к метке на карте. __Метка должна буть предварительно добавлена__. Возвращает true если
     * балун успешно добавлен
     * @method
     * @name YMap.setBalloonToPoint
     * @param {string} point_id
     * @param {BalloonOptionsType} balloonOptions
     * @param {PlaceMarkOptionsType} [placeMarkOptions]
     * @returns {boolean}
     */
    setBalloonToPoint(point_id, balloonOptions, placeMarkOptions) {
        if (this._pointsMap.has(point_id)) {
            const placeMark = this._pointsMap.get(point_id)
            placeMark.properties.setAll(balloonOptions)
            if (placeMarkOptions) {
                Object.keys(placeMarkOptions)
                    .forEach(key => placeMark.options.set(key, placeMarkOptions[key]))
            }
            return true
        }
        return false
    }

    autoZoom(defaultZoomLevel) {
        if (!this._map) return this
        const bounds = this._map.geoObjects.getBounds()
        bounds && this._map.setBounds(bounds)
        let zoom = Math.min(this._map.getZoom(), 15)
        if(defaultZoomLevel && zoom > defaultZoomLevel) {
            zoom = defaultZoomLevel
            this._zoom = zoom
        }else {
            this._zoom = zoom - 1
        }
        this._map.setZoom(this._zoom)
        return this
    }

    showPoint(coords, zoomLevel) {
        this._map.setCenter(coords, zoomLevel)
        if (zoomLevel) {
            this._zoom = zoomLevel
        }
        return this
    }

    getClosestAddressTo(coords) {
        return new Promise((resolve, reject) => {
            if (!(Array.isArray(coords) && coords.length === 2))
                reject(new Error(`Bad coordinates, method expect receive [number, number] but receive ${coords}`))

            if ('ymaps' in window) {
                window.ymaps.geocode(coords, {results: 5})
                    .then(res => {
                        /**@type{GeoObjectPropertiesType[]}*/
                        let pointsProperties = []
                        res.geoObjects.each(p => pointsProperties.push(p.properties.getAll()))

                        let closest = pointsProperties[0]
                        let dist = getDistanceFromTwoPoints(coords, closest.boundedBy[0])
                        for (let i = 1; i < pointsProperties.length; i += 1) {
                            const d = getDistanceFromTwoPoints(pointsProperties[i].boundedBy[0], closest.boundedBy[0])
                            if (d < dist)
                                closest = pointsProperties[i]
                        }
                        /**@type{PointType}*/
                        const point = {
                            address: closest.metaDataProperty.GeocoderMetaData.Address.formatted,
                            coords: closest.boundedBy[0],
                            kind: closest.metaDataProperty.GeocoderMetaData.kind,
                            locality: closest.metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.SubAdministrativeArea.Locality
                        }

                        resolve(point)
                    })
                    .catch(reject)
            } else {
                reject(new Error('Script ymaps is not loaded'))
            }

        })
    }

    /**
     * @methos
     * @name YMap.buildDetailRoute
     * @param {MapPointType[]} points
     * @returns {Promise<RouteDetailType>}
     */
    buildDetailRoute(points) {
        return new Promise(res => {
            if ('ymaps' in window) {
                const yPoints = points.map(p => ({type: 'viaPoint', point: p.coords}))
                window.ymaps.route(yPoints, {
                    mapStateAutoApply: true
                })
                    .then((route) => {
                        window.yroute = route
                        /**@type{RouteDetailType}*/
                        const fullRoute = {
                            travel_id: this._travel.id,
                            viaPoints: points.map(p => p.id),
                            routes: []
                        }
                        const length = route.getPaths().getLength()
                        for (let i = 0; i < route.getPaths().getLength(); i++) {
                            /**@type{RouteDetailSliceType}*/
                            const slice = {
                                from_id: points[i].id,
                                to_id: points[i + 1].id,
                                route: []
                            }
                            fullRoute.routes.push(slice)
                            const way = route.getPaths().get(i);
                            const segments = way.getSegments();
                            for (let j = 0; j < segments.length; j++) {
                                /**@type{Array<[number,number]>}*/
                                const c = segments[j].getCoordinates();
                                c.forEach(_c => fullRoute.routes[i].route.push(_c))
                            }
                        }
                        res(fullRoute)
                    })
                    .catch((err) => {
                        defaultHandleError(err)
                        res({travel_id: this._travel.id, routes: []})
                    })
            } else {
                res({travel_id: this._travel.id, routes: []})
            }

        })
    }

    removePoint(point_id) {
        if (this._pointsMap.has(point_id)) {
            const placemark = this._pointsMap.get(point_id)
            this._map.geoObjects.remove(placemark)
            this._pointsMap.delete(point_id)
        }
        return this
    }

    /**
     * @returns {PointType[]}
     */
    getMarkers() {
        return this._travel.waypoints || []
    }

    getDistance(point_1, point_2) {
        return 0;
    }

    // /**
    //  * @returns {Promise<[number, number][]>}
    //  */
    // _getDetailRoute(){
    //     return new Promise((resolve, reject) => {
    //         if('ymaps' in window){
    //             window.ymaps.route(this._travel.places.map(p => ({type: 'viaPoint', point: p.coords})))
    //                 .then(route =>{
    //                     const track = []
    //                     for (let i = 0; i < route.getPaths().getLength(); i++) {
    //                         const way = route.getPaths().get(i);
    //                         const segments = way.getSegments();
    //                         for (let j = 0; j < segments.length; j++) {
    //                             track.push(...segments[j].getCoordinates())
    //                         }
    //                     }
    //                     resolve(track)
    //                 })
    //                 .catch((err) => {
    //                     console.error(err)
    //                     resolve(this._travel.places.map(p => p.coords))
    //                 })
    //         } else
    //             resolve(this._travel.places.map(p => p.coords))
    //     })
    // }
}

window.distance = YMap.getDistance
