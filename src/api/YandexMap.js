import IMap from "./IMap";
import userPosition from "../utils/userPosition";
import ErrorReport from "../controllers/ErrorReport";

export default class YandexMap extends IMap {
    constructor({
                    suggestElementID,
                    mapContainerID,
                    coordsIDElement,
                    iconClass,
                    placemarks,
                    map,
                    script,
                    markerClassName
                }) {
        super();

        this.markerLayout = window.ymaps.templateLayoutFactory.createClass(`<div class="${this.markerClassName || ''}"></div>`);
        this.defaultZoom = 14
        this.coordsIDElement = coordsIDElement
        this.coordElement = document.getElementById(coordsIDElement)
        this.projection = map.options.get('projection');
        this.script = script
        this.locationWatchID = 0
        this.userTracking = false
        this.map = map
        this.placemarks = placemarks
        this.mapContainerID = mapContainerID
        this.placemarkIcon = window.ymaps.templateLayoutFactory.createClass(`<div class="${markerClassName}"></div>`);
        this.suggest = null
        this.setSuggestsTo(suggestElementID)

        const zoomControl = new window.ymaps.control.ZoomControl({
            options: {
                size: 'small'
            }
        })
        this.map.controls.add(zoomControl)

        this.map.events.add('dragend', console.log)
    }


    // добавление маркера на карту
    async addMarker(coords) {
        if (!coords || !Array.isArray(coords) || coords.length !== 2)
            throw new Error(`
            [YandexMap] не коректный формат координат
            получено: ${coords},
            ожидается массив вида: [latitude, longitude]
            `)

        if (this.tempPlacemark) {
            this.map.geoObjects.remove(this.tempPlacemark)
            this.tempPlacemark = null
        }

        const geocode = await window.ymaps.geocode(coords)
        const {
            text: textAddress,
            kind
        } = geocode.geoObjects.get(0).properties.getAll().metaDataProperty.GeocoderMetaData
        console.log(geocode)
        console.log({textAddress, kind})


        const placemark = new window.ymaps.Placemark(coords, {
            hintContent: textAddress,
            balloonContent: textAddress,
        }, {
            preset: 'islands#darkOrangeIcon',
            // iconLayout: this.markerLayout,
            draggable: true,
            cursor: 'pointer',
        })

        placemark.events.add('dragend', this._handlePlacemarkDrag.bind(this))


        const markInfo = {
            placemark,
            coords,
            textAddress,
            kind
        }

        this.placemarks.push(markInfo)
        this.map.geoObjects.add(placemark)
        this.autoZoom()
    }

    _handlePlacemarkDrag(e) {
        const p = e.originalEvent.target
        const placemark = this.placemarks.find(plm => plm.placemark === p)
        if (placemark) {
            this.placemarks = this.placemarks.filter(pm => pm !== placemark)
            const coords = p.geometry.getCoordinates()
            this.map.geoObjects.remove(p)
            this.addMarker(coords)
        }

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

    removeMarkerByLocalCoords(coords) {
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

        const removePlacemark = window.ymaps.geoQuery(this.placemarks.placemark).getClosestTo(coords)
        if (removePlacemark) {
            this.placemarks = this.placemarks.filter(p => p.placemark !== removePlacemark)
            this.map.geoObjects.remove(removePlacemark)
        }
    }

    getMarkers() {
        return this.placemarks//.map(p => ({placemark: p, coords: p.geometry.getCoordinates()}))
    }

    // метод устанавливает центр карты и зум так, чтобы все точки на карте попадали в область видимости
    autoZoom() {
        const options = {
            duration: 300
        }
        if (this.placemarks.length === 1) {
            options.zoom = 14
        }
        this.map.setBounds(this.map.geoObjects.getBounds(), options)
    }

    getZoom() {
        return this.defaultZoom
    }

    setZoom(zoomLevel) {
        if (zoomLevel < 0 || zoomLevel > 19) return
        this.defaultZoom = zoomLevel
        this._setZoom()
    }

    _setZoom() {
        this.map.setZoom(this.defaultZoom, {duration: 300})
    }

    setSuggestsTo(elementID) {
        if (!elementID || typeof elementID !== 'string') return
        if (this.suggest) this.suggest.destroy()
        this.suggest = new window.ymaps.SuggestView(elementID, {results: 3})
        this.suggest.events.add('select', this._selectSuggest.bind(this))
    }

    async _selectSuggest(e) {
        if (this.tempPlacemark){
            this.map.geoObjects.remove(this.tempPlacemark)
        }

        const item = e.get('item')
        if (item) {
            const geocode = await window.ymaps.geocode(item.value)
            window.geocode = geocode
            console.log(geocode.geoObjects.get(0))
            const coords = geocode.geoObjects.get(0).geometry.getCoordinates()
            const {text: textAddress} = geocode.geoObjects.get(0).properties.getAll().metaDataProperty.GeocoderMetaData

            this.tempPlacemark = new window.ymaps.Placemark(coords, {
                hintContent: textAddress,
                balloonContent: textAddress,
            }, {
                preset: 'islands#darkOrangeIcon',
                cursor: 'pointer',
            })

            this.map.geoObjects.add(this.tempPlacemark)
            this.map.setCenter(coords)
            this.map.setZoom(14, {duration: 300})
        }
    }


    // метод фокусируется на точке
    focusOnPoint(coords, zoomLevel) {
        this.map.setCenter(coords, zoomLevel || this.defaultZoom, {duration: 300})
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
            console.log(this)
            this.locationWatchID = navigator.geolocation.watchPosition((this.locationTracking).bind(this),
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
        if (this.coordElement && location.coords) {
            const {coords} = location
            this.coordElement.innerText = [coords.latitude, coords.longitude].toString()
        }
    }

    destroyMap() {
        this.locationWatchID && navigator.geolocation.clearWatch(this.locationWatchID)
        this.map && this.map.destroy()
        this.script && this.script.remove()
    }
}

//метод инициализации карты, возвращает экземпляр YandexMap.
YandexMap.init = function init({
                                   suggestElementID,
                                   api_key,
                                   mapContainerID,
                                   coordsIDElement,
                                   iconClass,
                                   points,
                                   markerClassName
                               }) {
    return new Promise((resolve, reject) => {
        if (!mapContainerID) reject(new Error('[YandexMap] mapContainerID is required'))

        const element = document.getElementById(mapContainerID)
        if (!element) reject(new Error(`[YandexMap] Can't not find element with id ${mapContainerID}`))

        const script = document.createElement('script')
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${api_key}&lang=ru_RU&load=Map,Placemark,geoQuery,templateLayoutFactory,geolocation,map.Converter,geocode,control.ZoomControl,SuggestView,templateLayoutFactory`
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
                            balloonContent: point.ballonContent,
                        }, {
                            preset: 'islands#darkOrangeIcon'
                            // iconLayout: this.markerLayout
                        })
                        map.geoObjects.add(placemark)
                        placemarks.push(placemark)
                    }
                }

                const yandexMap = new YandexMap({
                    mapContainerID,
                    coordsIDElement,
                    suggestElementID,
                    iconClass,
                    placemarks,
                    map,
                    script,
                    markerClassName
                })

                resolve(yandexMap)
            })
        }

        //добавление yandex maps api в htmlDOM
        element.appendChild(script)
    })
}