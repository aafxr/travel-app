import IMap from "./IMap";
import userPosition from "../utils/userPosition";
import ErrorReport from "../controllers/ErrorReport";

export default class YandexMap extends IMap {
    constructor({
                    mapContainerID,
                    iconClass,
                    placemarks,
                    map,
                    script
                }) {
        super();


        this.projection = map.options.get('projection');
        this.script = script
        this.locationWatchID = 0
        this.userTracking = false
        this.map = map
        this.placemarks = placemarks
        this.mapContainerID = mapContainerID
        this.placemarkIcon = window.ymaps.templateLayoutFactory.createClass(`<div class="${iconClass}"></div>`);
    }


    // добавление маркера на карту
    addMarker(coords, hintContent, balloonContent) {
        if (!coords || !Array.isArray(coords) || coords.length !== 2)
            throw new Error(`
            [YandexMap] не коректный формат координат
            получено: ${coords},
            ожидается массив вида: [latitude, longitude]
            `)

        const placemark = new window.ymaps.Placemark(coords, {
            hintContent: hintContent,
            balloonContent: balloonContent
        }, {
            preset: 'islands#darkOrangeCircleDotIcon'
        })

        this.placemarks.push(placemark)
        this.map.geoObjects.add(placemark)
    }

    addMarkerByLocalCoords(coords) {
        if (!coords || !Array.isArray(coords) || coords.length !== 2)
            throw new Error(`
            [YandexMap] не коректный формат координат
            получено: ${coords},
            ожидается массив вида: [latitude, longitude]
            `)

        const transformedCoords = this.projection.fromGlobalPixels(
            this.map.converter.pageToGlobal(coords), this.map.getZoom()
        )

        this.addMarker(transformedCoords)
    }

    removeMarkerByLocalCoords(coords){
        if (!coords || !Array.isArray(coords) || coords.length !== 2)
            throw new Error(`
            [YandexMap] не коректный формат координат
            получено: ${coords},
            ожидается массив вида: [latitude, longitude]
            `)

        const transformedCoords = this.projection.fromGlobalPixels(
            this.map.converter.pageToGlobal(coords), this.map.getZoom()
        )
        this.removeMarker(transformedCoords)
    }


    // удаление ближайшей к указанным координатам точки
    removeMarker(coords) {
        if (!coords || !Array.isArray(coords) || coords.length !== 2)
            throw new Error(`
            [YandexMap] не коректный формат координат
            получено: ${coords},
            ожидается массив вида: [latitude, longitude]
            `)

        const removePlacemark = window.ymaps.geoQuery(this.placemarks).getClosestTo(coords)
        if (removePlacemark) {
            this.placemarks = this.placemarks.filter(p => p !== removePlacemark)
            this.map.geoObjects.remove(removePlacemark)
        }
    }

    getMarkers() {
        return this.placemarks
    }

    //метод пытается получить координаты средствами браузера или средствами yandex maps api
    getUserLocation() {
        return new Promise(async (resolve, reject) => {
            try {
                const coords = await userPosition()
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


    enableUserTracking() {
        if ('geolocation' in navigator) {
            this.locationWatchID = navigator.geolocation.watchPosition(this.locationTracking.bind(this),
                err => ErrorReport.sendReport()
            )
        }
    }

    disableUserTracking() {
        if (this.userTracking) {
            navigator.geolocation.clearWatch(this.locationWatchID)
            this.userTracking = false
        }
    }


    //обработка позиции пользователя ...
    locationTracking(location) {
        if (!this.userTracking)
            this.userTracking = true
    }

    destroyMap() {
        this.locationWatchID && navigator.geolocation.clearWatch(this.locationWatchID)
        this.map && this.map.destroy()
        this.script && this.script.remove()
    }
}

//метод инициализации карты, возвращает экземпляр YandexMap.
YandexMap.init = function init({
                                   api_key,
                                   mapContainerID,
                                   iconClass,
                                   points
                               }) {
    return new Promise((resolve, reject) => {
        if (!mapContainerID) reject(new Error('[YandexMap] mapContainerID is required'))

        const element = document.getElementById(mapContainerID)
        if (!element) reject(new Error(`[YandexMap] Can't not find element with id ${mapContainerID}`))

        const script = document.createElement('script')
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${api_key}&lang=ru_RU&load=Map,Placemark,geoQuery,templateLayoutFactory,geolocation,map.Converter`
        script.onload = function () {
            window.ymaps.ready(() => {
                const map = new window.ymaps.Map(mapContainerID, {
                    center: [55.76, 37.64],
                    zoom: 7
                })

                //добавление точек на карту
                const placemarks = []
                if (points && Array.isArray(points)) {
                    for (const point of points) {
                        const placemark = new window.ymaps.Placemark(point.coords, {
                            hintContent: point.hintContent,
                            balloonContent: point.ballonContent
                        }, {
                            preset: 'islands#darkOrangeCircleDotIcon'
                        })
                        map.geoObjects.add(placemark)
                        placemarks.push(placemark)
                    }
                }

                const yandexMap = new YandexMap({
                    mapContainerID,
                    iconClass,
                    placemarks,
                    map,
                    script
                })

                resolve(yandexMap)
            })
        }

        //добавление yandex maps api в htmlDOM
        element.appendChild(script)
    })
}