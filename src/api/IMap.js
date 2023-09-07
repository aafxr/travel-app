export default class IMap {
    async init(){}


    // //добавить место на карту
    // addPlace() {
    //     console.warn('[IMap] addPlace not override')
    // }
    //
    // getPlaces() {
    //     console.warn('[IMap] getPlaces not override')
    // }

    //управление варкерами (добавление, удаление, список)
    addMarker() {
        console.warn('[IMap] addMarker not override')
    }

    addMarkerByLocalCoords(){
        console.warn('[IMap] addMarkerByLocalCoords not override')
    }

    removeMarkerByLocalCoords(){
        console.warn('[IMap] removeMarkerByLocalCoords not override')
    }

    removeMarker() {
        console.warn('[IMap] removeMarker not override')
    }

    getMarkers() {
        console.warn('[IMap] getMarkers not override')
    }

    // построить маршрут
    buildRoute() {
        console.warn('[IMap] buildRoute not override')
    }

    destroyRoute() {
        console.warn('[IMap] destroyRoute not override')
    }

    //локация пользователя
    // setUserLocation() {
    //     console.warn('[IMap] setUserLocation not override')
    // }

    async getUserLocation() {
        console.warn('[IMap] getUserLocation not override')
    }

    //включить / отключить траккинг позиции пользователя
    enableUserTracking() {
        console.warn('[IMap] enableUserTracking not override')
    }

    disableUserTracking() {
        console.warn('[IMap] disableUserTracking not override')
    }


    destroyMap(){}
}


const org = {
    name: "Яндекс",
    description: "ул. Льва Толстого, 16, Москва",
    boundedBy: [[55.731658, 37.582987], [55.73629, 37.591198]],
    type: "business",
    companyMetaData: {
        id: "1124715036",
        name: "Яндекс",
        address: "Москва, улица Льва Толстого, 16",
        url: "https://ya.ru/",
        Phones: [{type: "phone", formatted: "8 (800) 250-96-39"}],
        Hours: {
            text: "пн-пт 10:00–19:00",
            Availabilities: [{
                Intervals: [{from: "10:00:00", "to": "19:00:00"}],
                Monday: true,
                Tuesday: true,
                Wednesday: true,
                Thursday: true,
                Friday: true
            }]
        }
    },
    id: "1124715036",
    address: "Москва, улица Льва Толстого, 16",
    url: "https://ya.ru/",
    categories: ["IT-компания", "Интернет-маркетинг", "Информационный интернет-сайт"],
    categoriesText: "IT-компания, интернет-маркетинг, информационный интернет-сайт",
    rating: {ratings: 17174, "reviews": 4056, "score": 5},
    uri: "ymapsbm1://org?oid=1124715036",
    point: [37.588144, 55.733842],
}


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