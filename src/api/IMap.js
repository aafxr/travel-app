/**
 * @typedef IMapOptionsType
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
 * @typedef IMapPointOptionsType
 * @property {string} hintContent
 * @property {string} balloonContent
 * @property {'add' | 'exist'} markerType
 * @property {boolean} draggable
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
     * @param {IMapOptionType} options
     */
    constructor(options) {}


    /**
     * @abstract
     * @name IMap.newPoint
     * @param {string} primary_entity_id
     * @returns{PointType}
     */
    newPoint(primary_entity_id){
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
     * @param {PointType} point
     * @param {IMapPointOptionsType} [options]
     */
    addPoint(point, options = {}) {
    }

    /**
     * добавить точку на карту по указанному адресу
     * @method IMap.addMarkerByAddress
     * @param {string} address
     * @param {string} id
     * @returns {PointType | null}
     * @returns {Promise<PointType | null>}
     */
    addMarkerByAddress(address, id){
        console.warn('[IMap] addMarkerByAddress not override')
    }

    /**
     * Метод удаляет точку с карты. Метод принимает обЪект, который возвращает метод "getMarkers"
     * @method IMap.removeMarker
     * @param {string} point_id
     */
    removePoint(point_id) {
        console.warn('[IMap] removeMarker not override')
    }

    /**
     * @abstract
     * @name IMap.destroyMap
     */
    destroyMap() {
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
     * @param {PlaceType[]} points
     * @param {string} routeName
     * @returns {IMap}
     */
    showRoute(points, routeName) {
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
     * @return {IMap}
     */
    autoZoom(){
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
        console.warn('[IMap] focusOnPointType not override')
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
    getUserLocation() {
    }
    // setUserLocation() {
    //     console.warn('[IMap] setUserLocation not override')
    // }

    /**
     * @method IMap.getUserLocation
     * @returns {Promise<Array.<number, number>>}
     */
    async getUserLocation() {
        console.warn('[IMap] getUserLocation not override')
    }

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
     * очистка карты от точек
     * @method IMap.clear
     */
    clear(){}

    /**
     * метод перестраивает карту
     * @method IMap.refreshMap
     */
    refreshMap(){}


    /**
     * очистка ресурсов выделенных под карту
     * @method IMap.destroyMap
     */
    destroyMap(){}
}


// const org = {
//     name: "Яндекс",
//     description: "ул. Льва Толстого, 16, Москва",
//     boundedBy: [[55.731658, 37.582987], [55.73629, 37.591198]],
//     type: "business",
//     companyMetaData: {
//         id: "1124715036",
//         name: "Яндекс",
//         address: "Москва, улица Льва Толстого, 16",
//         url: "https://ya.ru/",
//         Phones: [{type: "phone", formatted: "8 (800) 250-96-39"}],
//         Hours: {
//             text: "пн-пт 10:00–19:00",
//             Availabilities: [{
//                 Intervals: [{from: "10:00:00", "to": "19:00:00"}],
//                 Monday: true,
//                 Tuesday: true,
//                 Wednesday: true,
//                 Thursday: true,
//                 Friday: true
//             }]
//         }
//     },
//     id: "1124715036",
//     address: "Москва, улица Льва Толстого, 16",
//     url: "https://ya.ru/",
//     categories: ["IT-компания", "Интернет-маркетинг", "Информационный интернет-сайт"],
//     categoriesText: "IT-компания, интернет-маркетинг, информационный интернет-сайт",
//     rating: {ratings: 17174, "reviews": 4056, "score": 5},
//     uri: "ymapsbm1://org?oid=1124715036",
//     PointType: [37.588144, 55.733842],
// }


// const org = {
//     name: "Яндекс",
//     description: "ул. Льва Толстого, 16, Москва",
//     boundedBy: [[55.731658, 37.582987], [55.73629, 37.591198]],
//     responseMetaData: {
//         id: "1124715036",
//         name: "Яндекс",
//         address: "Москва, улица Льва Толстого, 16",
//         url: "https://ya.ru/",
//         Phones: [{"type": "phone", "formatted": "8 (800) 250-96-39"}, {
//             type: "phone",
//             formatted: "+7 (495) 739-23-32"
//         }, {type: "phone", formatted: "+7 (495) 739-70-00"}, {
//             type: "phone",
//             formatted: "+7 (495) 739-70-70"
//         }, {type: "phone", formatted: "+7 (495) 974-35-81"}],
//         Categories: [{name: "IT-компания", "class": "software"}, {
//             name: "Интернет-маркетинг",
//             "class": "software"
//         }, {name: "Информационный интернет-сайт", "class": "software"}],
//         Hours: {
//             text: "пн-пт 10:00–19:00",
//             Availabilities: [{
//                 Intervals: [{"from": "10:00:00", "to": "19:00:00"}],
//                 Monday: true,
//                 Tuesday: true,
//                 Wednesday: true,
//                 Thursday: true,
//                 Friday: true
//             }]
//         }
//     },
//     uriMetaData: {
//         URIs: [{"uri": "ymapsbm1://org?oid=1124715036"}],
//         URI: {"uri": "ymapsbm1://org?oid=1124715036"}
//     },
//     type: "business",
//     companyMetaData: {
//         id: "1124715036",
//         name: "Яндекс",
//         address: "Москва, улица Льва Толстого, 16",
//         url: "https://ya.ru/",
//         Phones: [{"type": "phone", formatted: "8 (800) 250-96-39"}, {
//             type: "phone",
//             formatted: "+7 (495) 739-23-32"
//         }, {type: "phone", formatted: "+7 (495) 739-70-00"}, {
//             type: "phone",
//             formatted: "+7 (495) 739-70-70"
//         }, {type: "phone", formatted: "+7 (495) 974-35-81"}],
//         Categories: [{name: "IT-компания", "class": "software"}, {
//             name: "Интернет-маркетинг",
//             "class": "software"
//         }, {name: "Информационный интернет-сайт", "class": "software"}],
//         Hours: {
//             text: "пн-пт 10:00–19:00",
//             Availabilities: [{
//                 Intervals: [{"from": "10:00:00", "to": "19:00:00"}],
//                 Monday: true,
//                 Tuesday: true,
//                 Wednesday: true,
//                 Thursday: true,
//                 Friday: true
//             }]
//         }
//     },
//     id: "1124715036",
//     address: "Москва, улица Льва Толстого, 16",
//     url: "https://ya.ru/",
//     categories: ["IT-компания", "Интернет-маркетинг", "Информационный интернет-сайт"],
//     categoriesText: "IT-компания, интернет-маркетинг, информационный интернет-сайт",
//     phoneNumbers: ["8 (800) 250-96-39", "+7 (495) 739-23-32", "+7 (495) 739-70-00", "+7 (495) 739-70-70", "+7 (495) 974-35-81"],
//     workingTime: "пн-пт 10:00–19:00",
//     workingStatus: {"isWork": false, "time": "10:00"},
//     workingTimeModel: {
//         _availabilities: [null, {
//             _intervals: [{
//                 from: {"_hours": 10, "_minutes": 0},
//                 to: {"_hours": 19, "_minutes": 0}
//             }]
//         }, {
//             intervals: [{
//                 from: {"_hours": 10, "_minutes": 0},
//                 to: {"_hours": 19, "_minutes": 0}
//             }]
//         }, {
//             intervals: [{
//                 from: {"_hours": 10, "_minutes": 0},
//                 to: {"_hours": 19, "_minutes": 0}
//             }]
//         }, {
//             intervals: [{
//                 from: {"_hours": 10, "_minutes": 0},
//                 to: {"_hours": 19, "_minutes": 0}
//             }]
//         }, {intervals: [{from: {"_hours": 10, "_minutes": 0}, to: {"_hours": 19, "_minutes": 0}}]}, null]
//     },
//     stops: [{
//         name: "Парк культуры",
//         distance: "500 м",
//         color: "#805139",
//         coordinates: [37.593365143, 55.735123467]
//     }, {
//         name: "Парк культуры",
//         distance: "540 м",
//         color: "#f23d30",
//         coordinates: [37.593250009, 55.735337754]
//     }, {name: "Фрунзенская", distance: "1,11 км", color: "#f23d30", coordinates: [37.580583447, 55.727395255]}],
//     rating: {ratings: 17174, "reviews": 4056, "score": 5},
//     uri: "ymapsbm1://org?oid=1124715036",
//     PointType: [37.588144, 55.733842],
//     loc: {
//         timeClosedUntil: "Закрыто до 10:00",
//         timeOpenUntil: "Открыто до 10:00",
//         ratingReviews: "отзывов",
//         ratingRatings: "оценки"
//     },
//     taxiInfo: {
//         classLevel: 50,
//         className: "econom",
//         classText: "Эконом",
//         minPrice: 309,
//         price: 309,
//         waitingTime: 178,
//         currency: "RUB",
//         openTaxiAppUrl: "https://3.redirect.appmetrica.yandex.com/route?utm_source=yamaps&utm_medium=api&appmetrica_tracking_id=241755468559577482&ref=2334695&domain=ru&lang=ru&start-lat=&start-lon=&end-lat=55.733842&end-lon=37.588144"
//     },
//     feedbackElementIsNeeded: true
// }