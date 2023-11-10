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
    _pointsMap= new Map()


    /** @param {YMapOptionsType} options */
    constructor(options) {
        this._travel = options.travel
        if(options.points) this.points = options.points

        this._onPointMoved = options.onPointMoved   || (() => {})
        this._onPointClick = options.onPointClick   || (() => {})
        this._onPointAdd = options.onPointAdd       || (() => {})

        this._zoom = options.zoom                   || 7
        this._center = options.center               || [55.02629924781924, 82.92193912995225]
        this._container_id = options.container_id   || 'map'
        this._add_location_icon = options.add_location_icon || ''
        this._location_icon = options.location_icon || ''
        this._icon_size = options.icon_size         || [32,32]
    }

    /**
     * Метод выподняет первую настройку карты
     * @method
     * @name YMap._initializeMap
     * @private
     */
    _initializeMap(){

    }

    /**
     * Возвращает кратчайшее (вдоль геодезической линии) расстояние между двумя заданными точками (в метрах).
     * @method
     * @name YMap.getDistance
     * @param {CoordinatesType} point_1
     * @param {CoordinatesType} point_2
     * @returns {number}
     */
    getDistance(point_1, point_2){
        if(point_1 && point_2) {
            return window.ymaps.coordSystem.geo.getDistance(point_1, point_2)
        } else{
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
    setContainerID(container_id){
        if(container_id){
            if(this._map) this._map.destructor()
            this._container_id = container_id
            this.map = new window.ymaps.Map(this._container_id, this._center, this._zoom)
            this._initializeMap()
        }
        return this
    }

    /**
     * @method
     * @name YMap.newPoint
     * @returns {PointType}
     */
    newPoint(){
        return defaultPoint(this._travel.id)
    }

    /**
     * @method
     * @name YMap.addPoint
     * @param {PointType} point
     * @param {YMapPointOptionsType} [options]
     */
    addPoint(point, options = {}){
        if(point){
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

    async getPointByAddres(address){
        const geocoder = window.ymaps.geocode(address)
        await geocoder
            .then(res => {
                window.res = res
                /** информация о найденом месте */
                const geoObject = res.geoObjects.get(0)
            })
    }

}