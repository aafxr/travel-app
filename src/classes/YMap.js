/**
 * @typedef YMapOptionsType
 * @property {Travel} travel
 * @property {PointType[]} points
 * @property {(point: PointType) => unknown} onPointMoved
 * @property {(point: PointType) => unknown} onPointClick
 * @property {(point: PointType) => unknown} onPointAdd
 * @property {number} zoom
 * @property {CoordinatesType} center
 * @property {string} container_id
 * @property {string} add_location_icon
 * @property {string} location_icon
 * @property {[number, number]} icon_size
 */

/**
 * @typedef YMapPointOptionsType
 * @property {string} hintContent
 * @property {string} balloonContent
 * @property {'add' | 'exist'} markerType
 * @property {boolean} draggable
 */


import defaultPoint from "../utils/default-values/defaultPoint";
import userLocation from "../utils/userLocation";

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
export default class YMap {
    /**@type{PointType[]}*/
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
     * Метод выподняет первую настройку карты
     * @method
     * @name YMap._initializeMap
     * @private
     */
    _initializeMap() {

    }

    /**
     * Возвращает кратчайшее (вдоль геодезической линии) расстояние между двумя заданными точками (в метрах).
     * @method
     * @name YMap.getDistance
     * @param {CoordinatesType} point_1
     * @param {CoordinatesType} point_2
     * @returns {number}
     */
    getDistance(point_1, point_2) {
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
            if (this._map) this._map.destructor()
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
     * @returns {PointType}
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
            try {
                const coords = await userLocation()
                resolve(coords)
            } catch (err) {
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
     * @param {PointType} point
     * @param {YMapPointOptionsType} [options]
     */
    addPoint(point, options = {}) {
        if (point) {
            const placemark = window.ymaps.Placemark(point.coords, {
                hintContent: options.hintContent,
                balloonContent: options.balloonContent,
            }, {
                iconLayout: 'default#image',
                iconImageHref: options.markerType === 'exist' ? this._location_icon : this._add_location_icon,
                iconImageSize: this._icon_size,
                iconImageOffset: [-this._icon_size[0] / 2, -this._icon_size[1]],
                draggable: options.draggable ?? true,
                cursor: 'pointer',
            })

            this._map.geoObjects.add(placemark)
            this._pointsMap.set(point.id, placemark)
        }
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

    /**
     * @method
     * @name YMap.showRoute
     * @param {PlaceType[]} points
     * @param {string} routeName
     * @returns {YMap}
     */
    showRoute(points, routeName) {
        this.clearMap()
        if (!this._map) {

        }
        for (const point of points) {

            try {

                const placemark = new window.ymaps.Placemark([+point.location.lat, +point.location.lng], {
                    hintContent: point.name,
                    balloonContent: point.name,
                }, {
                    iconLayout: 'default#image',
                    iconImageHref: this._location_icon,
                    iconImageSize: this._icon_size,
                    iconImageOffset: [-this._icon_size[0] / 2, -this._icon_size[1]],
                    draggable: false,
                    cursor: 'pointer',
                })

                this._pointsMap.set(point.id, placemark)
                this._map.geoObjects.add(placemark)
            } catch (err) {
                console.error(err)
            }
        }

        this._polyLine = new window.ymaps.Polyline(points.map(p => [p.location.lat, p.location.lng]), {
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

}
