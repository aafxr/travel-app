/**
 * @description предпологаемое описание объекта
 * @typedef {Object} Point
 * @property {string} id
 * @property {[number, number]} coords
 * @property {string} kind
 * @property {string} textAddress
 * @property {string} locality
 * @property {Object} placemark
 */


/**
 * интерфейс для работы с картами. карта создается при помощи метода init
 * @classdesc Not a real class but an interface. Etc...
 * @name IMap
 * @class
 */
export default class IMap {
    async init(){}

    //управление маркерами (добавление, удаление, список)
    /**
     * дообавить точку на карт по координатам
     * @method IMap.addMarker
     * @param {[number, number]} coords
     * @param {string} id
     * @returns{Promise<Point | null>}
     */
    addMarker(coords, id) {
        console.warn('[IMap] addMarker not override')
    }

    /**
     * добавить точку на карту по координатам блока-контейнера карты
     * @method IMap.addMarkerByLocalCoords
     * @param {[number, number]} localCoords
     * @returns {Point | null}
     */
    addMarkerByLocalCoords(localCoords){
        console.warn('[IMap] addMarkerByLocalCoords not override')
    }

    /**
     * удалить точку на карту по координатам блока-контейнера карты
     * @method IMap.removeMarkerByLocalCoords
     * @param {[number, number]} localCoords
     */
    removeMarkerByLocalCoords(localCoords){
        console.warn('[IMap] removeMarkerByLocalCoords not override')
    }

    /**
     * добавить точку на карту по указанному адресу
     * @method IMap.addMarkerByAddress
     * @param {string} address
     * @param {string} id
     * @returns {Point | null}
     * @returns {Promise<Point | null>}
     */
    addMarkerByAddress(address, id){
        console.warn('[IMap] addMarkerByAddress not override')
    }

    /**
     * Метод удаляет точку с карты. Метод принимает обЪект, который возвращает метод "getMarkers"
     * @method IMap.removeMarker
     * @param {Object} marker
     */
    removeMarker(marker) {
        console.warn('[IMap] removeMarker not override')
    }

    /**
     * возвращает массив объектов, описывающих точки на карте. Каждый объект содержит адрес, координаты
     * @method IMap.getMarkers
     * @returns {Point[]}
     */
    getMarkers() {
        console.warn('[IMap] getMarkers not override')
    }

    /**
     * установка зума карты
     * @method IMap.setZoom
     * @param {number} value
     */
    setZoom(value){
        console.warn('[IMap] setZoom not override')
    }

    /**
     * получение текущего зума карты
     * @method IMap.getZoom
     * @returns {number}
     */
    getZoom(){
        console.warn('[IMap] getZoom not override')
    }

    /**
     * установка зума карты так, чтобы все точки на карте попадали в область блока-контейнера карты
     * @method IMap.autoZoom
     */
    autoZoom(){
        console.warn('[IMap] autoZoom not override')
    }

    /**
     * добавление подсказок к полю ввода адреса
     * @method IMap.setSuggestsTo
     * @param {string} elementID - id  поля ввода
     */
    setSuggestsTo(elementID){
        console.warn('[IMap] setSuggestsTo not override')
    }

    /**
     * удаление подсказок
     * @method IMap.removeSuggest
     */
    removeSuggest(){
        console.warn('[IMap] removeSuggest not override')
    }

    /**
     * установка фокуса на точке (точка утанавливается по центру экрана)
     * @method IMap.focusOnPoint
     * @param {[number, number]} coords
     * @param {number} zoomLevel
     */
    focusOnPoint(coords, zoomLevel){
        console.warn('[IMap] focusOnPoint not override')
    }

    // построить маршрут
    /**
     * @method IMap.buildRoute
     */
    buildRoute() {
        console.warn('[IMap] buildRoute not override')
    }

    /**
     * @method IMap.destroyRoute
     */
    destroyRoute() {
        console.warn('[IMap] destroyRoute not override')
    }

    //локация пользователя
    // setUserLocation() {
    //     console.warn('[IMap] setUserLocation not override')
    // }

    /**
     * @method IMap.getUserLocation
     * @returns {Promise<[number, number]>}
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
//     point: [37.588144, 55.733842],
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
//     point: [37.588144, 55.733842],
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