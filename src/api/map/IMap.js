/**
 * @typedef IMapOptionsType
 * @property {Travel} travel
 * @property {MapWaypointType[]} points
 * @property {(point: MapWaypointType) => unknown} onPointMoved
 * @property {(point: MapWaypointType) => unknown} onPointClick
 * @property {(point: MapWaypointType) => unknown} onPointAdd
 * @property {number} zoom
 * @property {CoordinatesType} center
 * @property {string} container_id
 * @property {string} add_location_icon
 * @property {string} location_icon
 * @property {[number, number]} icon_size
 */

/**
 * @typedef IMapPointOptionsType
 * @property {string} [hintContent]
 * @property {string} [balloonContent]
 * @property {'add' | 'exist'} markerType
 * @property {boolean} [draggable]
 * @property {string} [iconText]
 */


/**
 * интерфейс для работы с картами. карта создается при помощи метода init
 * @classdesc Not a real class but an interface. Etc...
 * @name IMap
 * @class
 *
 * @constructor
 * @param {IMapOptionType} options
 *
 */
export default class IMap {

    /**
     * @abstract
     * @name IMap.newPoint
     * @returns{MapWaypointType}
     */
    newPoint(){
    }

    /**
     * Возвращает кратчайшее (вдоль геодезической линии) расстояние между двумя заданными точками (в метрах).
     * @abstract
     * @name IMap.getDistance
     * @param {CoordinatesType} point_1
     * @param {CoordinatesType} point_2
     * @returns {number}
     */
    getDistance(point_1, point_2) {
    }

    /**
     * установка нового id контейнера карты
     * @abstract
     * @name IMap.setContainerID
     * @param {string} container_id
     * @returns {IMap}
     */
    setContainerID(container_id) {
    }

    /**
     * @abstract
     * @name IMap.clearMap
     * @returns {IMap}
     */
    clearMap() {
    }

    //управление маркерами (добавление, удаление, список)
    /**
     * @abstract
     * @name IMap.addPoint
     * @param {MapWaypointType} point
     * @param {IMapPointOptionsType} [options]
     * @return {IMap}
     */
    addPoint(point, options = {}) {
    }

    // /**
    //  * добавить точку на карту по указанному адресу
    //  * @method IMap.addMarkerByAddress
    //  * @param {string} address
    //  * @param {string} id
    //  * @returns {MapWaypointType | null}
    //  * @returns {Promise<MapWaypointType | null>}
    //  */
    // addMarkerByAddress(address, id){
    //     console.warn('[IMap] addMarkerByAddress not override')
    // }

    /**
     * Метод удаляет точку с карты. Метод принимает обЪект, который возвращает метод "getMarkers"
     * @method IMap.removeMarker
     * @param {string} point_id
     * @return {IMap}
     */
    removePoint(point_id) {
        console.warn('[IMap] removeMarker not override')
    }

    /**
     * поиск подходящих под переданный адресс мест. Возвращается массив найденных мест
     * @abstract
     * @name IMap.getPointByAddress
     * @param {string} address
     * @returns {Promise<any[]>}
     */
    async getPointByAddress(address) {
    }

    /**
     * @abstract
     * @name IMap.showRoute
     * @param {MapWaypointType[]} points
     * @param {IMapOptionsType} options
     * @returns {IMap}
     */
    showRoute(points, options) {
    }

    /**
     * метод добавляет балун к метке на карте. __Метка должна буть предварительно добавлена__. Возвращает true если
     * балун успешно добавлен
     * @abstract
     * @name IMap.setBalloonToPoint
     * @param {string} point_id
     * @param {BalloonOptionsType} balloonOptions
     * @param {PlaceMarkOptionsType} [placeMarkOptions]
     * @returns {boolean}
     */
    setBalloonToPoint(point_id, balloonOptions, placeMarkOptions) {
    }

    /**
     * установка зума карты
     * @abstract
     * @name IMap.setZoom
     * @param {number} value
     */
    setZoom(value){
        console.warn('[IMap] setZoom not override')
    }

    /**
     * получение текущего зума карты
     * @abstract
     * @name IMap.getZoom
     * @returns {number}
     */
    getZoom(){
        console.warn('[IMap] getZoom not override')
    }

    /**
     * установка зума карты так, чтобы все точки на карте попадали в область блока-контейнера карты
     * @abstract
     * @name IMap.autoZoom
     * @param {number} [defaultZoomLevel]
     * @return {IMap}
     */
    autoZoom(defaultZoomLevel){
        console.warn('[IMap] autoZoom not override')
    }

    // /**
    //  * добавление подсказок к полю ввода адреса
    //  * @method IMap.setSuggestsTo
    //  * @param {string} elementID - id  поля ввода
    //  */
    // setSuggestsTo(elementID){
    //     console.warn('[IMap] setSuggestsTo not override')
    // }

    // /**
    //  * удаление подсказок
    //  * @method IMap.removeSuggest
    //  */
    // removeSuggest(){
    //     console.warn('[IMap] removeSuggest not override')
    // }

    /**
     * установка фокуса на точке (точка утанавливается по центру экрана)
     * @abstract
     * @name IMap.showPoint
     * @param {CoordinatesType} coords
     * @param {number} [zoomLevel]
     * @return {IMap}
     */
    showPoint(coords, zoomLevel){
        console.warn('[IMap] focusOnMapWaypointType not override')
    }

    // построить маршрут
    /**
     * @method IMap.destroyRoute
     */
    destroyRoute() {
        console.warn('[IMap] destroyRoute not override')
    }

    //локация пользователя
    /**
     * метод пытается получить координаты средствами браузера или средствами yandex maps api
     * @abstract
     * @name IMap.getUserLocation
     * @returns {Promise<[number, number]>}
     */
    async getUserLocation() {
    }
    // setUserLocation() {
    //     console.warn('[IMap] setUserLocation not override')
    // }

    //включить / отключить траккинг позиции пользователя
    /**
     * @method IMap.enableUserTracking
     */
    enableUserTracking() {
        console.warn('[IMap] enableUserTracking not override')
    }

    /**
     * @method IMap.disableUserTracking
     */
    disableUserTracking() {
        console.warn('[IMap] disableUserTracking not override')
    }

    /**
     * вызывается если размеры контейнера ищменилися
     * @method IMap.resize
     */
    resize(){}

    /**
     * метод перестраивает карту
     * @method IMap.refreshMap
     */
    refreshMap(){}


    /**
     * очистка ресурсов выделенных под карту
     * @abstract
     * @method
     * @name IMap.destroyMap
     */
    destroyMap(){}

    /**
     * @abstract
     * @name IMap.getMarkers
     * @deprecated
     */
    getMarkers(){}

    /**
     * @method
     * @name IMap.showPolyline
     * @param {MapWaypointType[]} polyline
     * @param {BalloonOptionsType} options
     * @return {IMap}
     * @deprecated
     */
    showPolyline(polyline, options){}

    /**
     * @method
     * @name IMap.showPolyRoute
     * @param polylineDots
     * @param BalloonOptionsType
     * @return {IMap}
     */
    showPolyRoute(polylineDots, BalloonOptionsType){}

    /**
     * @abstract
     * @name IMap.getClosestAddressTo
     * @param {CoordinatesType} coords
     * @return {Promise<Omit<WaypointType, 'id'>>}
     */
    getClosestAddressTo(coords){}

    /**
     * @methos
     * @name IMap.buildDetailRoute
     * @param {MapWaypointType[]} points
     * @returns {Promise<RouteDetailSliceType>}
     */
    buildDetailRoute(points){}
}

