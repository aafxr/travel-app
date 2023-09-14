import IMap from "./IMap";
import userPosition from "../utils/userPosition";
import ErrorReport from "../controllers/ErrorReport";
import sleep from "../utils/sleep";

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
        this.defaultZoom = map.getZoom() || 14
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
        this.suggests = []
        this.setSuggestsTo(suggestElementID)

        this.getUserLocation().then(userLocation => {
            if (userLocation)
                this.map.setCenter(userLocation, this.defaultZoom, {duration: 300})
        })

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
        const geoObject = geocode.geoObjects.get(0)

        const markInfo = this._newMarker(geoObject)

        this.placemarks.push(markInfo)
        this.map.geoObjects.add(markInfo.placemark)
        this.autoZoom()
    }

    _newMarker(geoObject) {
        if (!geoObject || typeof geoObject !== 'object') {
            throw new Error('[YandexMap._newMarker] geoObject should be define and typeof "object"')
        }

        const coords = geoObject.geometry.getCoordinates()
        const {
            text: textAddress,
            kind
        } = geoObject.properties.getAll().metaDataProperty.GeocoderMetaData

        const placemark = new window.ymaps.Placemark(coords, {
            hintContent: textAddress,
            balloonContent: textAddress,
        }, {
            preset: 'islands#darkOrangeIcon',
            iconLayout: this.placemarkIcon,
            draggable: true,
            cursor: 'pointer',
        })

        placemark.events.add('dragend', this._handlePlacemarkDrag.bind(this))

        return {placemark, coords, textAddress, kind}
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

    async addMarkerByAddress(address) {
        const existingAddress = this.placemarks.find(p => p.textAddress === address)
        if (existingAddress) return existingAddress

        const geocoder = window.ymaps.geocode(address)
        return await geocoder
            .then(res => {
                if (this.tempPlacemark) {
                    this.map.geoObjects.remove(this.tempPlacemark)
                    this.tempPlacemark = null
                }
                // закрытие подсказок
                sleep(100).then(() => this.suggests.map(s => s.suggest.state.set('panelClosed', true)))

                const geoObject = res.geoObjects.get(0)
                if (geoObject) {
                    const newMarker = this._newMarker(geoObject)
                    this.placemarks.push(newMarker)
                    this.map.geoObjects.add(newMarker.placemark)
                    this.autoZoom()
                    return newMarker
                } else {
                    return null
                }
            })
            .catch((err) => {
                console.error(err)
                return null
            })
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
    removeMarker(placemark) {
        if (!placemark || typeof placemark !== 'object')
            throw new Error(`
            [YandexMap] не коректный формат данных
            получено: ${placemark},
            ожидается объект (возвращаемые методом "getMarkers".
            `)

        this.placemarks = this.placemarks.filter(p => p !== placemark)
        this.map.geoObjects.remove(placemark.placemark)
    }

    getMarkers() {
        return this.placemarks//.map(p => ({placemark: p, coords: p.geometry.getCoordinates()}))
    }


    // метод устанавливает центр карты и зум так, чтобы все точки на карте попадали в область видимости
    autoZoom() {
        const options = {
            duration: 300,
            zoom: this.defaultZoom
        }
        if (this.placemarks.length === 1) {
            options.zoom = 14
        }
        const bounds = this.map.geoObjects.getBounds()
        if (bounds) {
            this.map.setBounds(bounds, options)
            let zoom = this.map.getZoom()
            zoom > 14 && (zoom = 14)
            this.defaultZoom = zoom
            this.map.setZoom(this.defaultZoom)
        }
    }

    getZoom() {
        return this.defaultZoom
    }

    setZoom(zoomLevel) {
        if (zoomLevel < 0 || zoomLevel > 19) return
        this.defaultZoom = zoomLevel
        this.map.setZoom(zoomLevel, {duration: 300})
        this._setZoom()
    }

    _setZoom() {
        this.map.setZoom(this.defaultZoom, {duration: 300})
    }

    setSuggestsTo(elementID) {
        if (!elementID || typeof elementID !== 'string') return

        const isSuggestExist = !!this.suggests.find(s => s.elementID === elementID)
        if (!isSuggestExist) {
            const newSuggest = new window.ymaps.SuggestView(elementID, {results: 3})
            newSuggest.events.add('select', this._selectSuggest.bind(this))
            this.suggests.push({elementID, suggest: newSuggest})
        }
    }

    async _selectSuggest(e) {
        if (this.tempPlacemark) {
            this.map.geoObjects.remove(this.tempPlacemark)
        }

        const item = e.get('item')
        if (item) {
            const geocode = await window.ymaps.geocode(item.displayName)
            window.geocode = geocode
            console.log(geocode.geoObjects.get(0))
            const coords = geocode.geoObjects.get(0).geometry.getCoordinates()
            const {text: textAddress} = geocode.geoObjects.get(0).properties.getAll().metaDataProperty.GeocoderMetaData

            this.tempPlacemark = new window.ymaps.Placemark(coords, {
                hintContent: textAddress,
                balloonContent: textAddress,
            }, {
                preset: 'islands#darkOrangeIcon',
                iconLayout: this.placemarkIcon,
                cursor: 'pointer',
            })

            this.map.geoObjects.add(this.tempPlacemark)
            console.log(this)
            this.map.setCenter(coords, this.defaultZoom || 14, {duration: 300})
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

    resize() {
        // this.map.redraw()
    }

    destroyMap() {
        this.locationWatchID && navigator.geolocation.clearWatch(this.locationWatchID)
        this.map && this.map.destroy()
        this.script && this.script.remove()
        this.suggest && this.suggests.forEach(s => s.suggest.destroy())
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
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${api_key}&lang=ru_RU&load=Map,Placemark,geoQuery,templateLayoutFactory,geolocation,map.Converter,geocode,SuggestView,templateLayoutFactory,route`
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
                            balloonContent: point.balloonContent,
                        }, {
                            preset: 'islands#darkOrangeIcon',
                            iconLayout: this.placemarkIcon,
                            draggable: true
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
