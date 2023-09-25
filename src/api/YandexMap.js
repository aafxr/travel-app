import IMap from "./IMap";
import userLocation from "../utils/userLocation";
import ErrorReport from "../controllers/ErrorReport";
import {pushAlertMessage} from "../components/Alerts/Alerts";

import locationIcon from './place_24px.svg'


export default class YandexMap extends IMap {
    /**
     * обертка для работы с api yandex maps
     * @param {string} suggestElementID     - id элемента для которого будут добавлены подсказки
     * @param {string} mapContainerID       - id контецнера карты
     * @param {Point[]} placemarks          - массив добавленных на карту точек, при вызове метода init
     * @param {object} map                  - инстанс карты созданный с помощью api
     * @param {HTMLScriptElement} script
     * @param {string} markerClassName      - класс для кастомного маркера на карте
     */
    constructor({
                    suggestElementID,
                    mapContainerID,
                    placemarks,
                    map,
                    script,
                    markerClassName
                }) {
        super();

        /** текущий зум карты */
        this.zoom = map.getZoom() || 14
        /** данная сущность использууется для трансформации координат блока-контейнера в мировые координаты  карты  */
        this.projection = map.options.get('projection');
        /** ссылка на DOM Node Element yandex maps api */
        this.script = script
        /** id - генерируемый api браузерв при вызове  navigator.geolocation.watchPosition */
        this.locationWatchID = 0
        /** флаг о включенном трэкинге геолокации пользователя */
        this.userTracking = false
        /** сущность предстаавлябщая карту */
        this.map = map
        /** массив с информацией о добавленных на карту точках */
        this.placemarks = placemarks
        /** id HTMLElement-а контейнера карты */
        this.mapContainerID = mapContainerID
        /** LayoutClass для отображения кастомного маркера на карте */
        this.placemarkIcon = window.ymaps.templateLayoutFactory.createClass(`<div class="${markerClassName}"></div>`);
        /**  выпадающая панель с поисковыми подсказками, которая прикрепляется к HTML-элементу <input type="text">. */
        this.suggest = null
        this.setSuggestsTo(suggestElementID)

        this.getUserLocation().then(userLocation => {
            if (userLocation)
                this.map.setCenter(userLocation, this.zoom, {duration: 300})
        })

        this.map.events.add('dragend', console.log)
    }


    /**
     * добавление маркера на карту
     * @param {number, number} coords
     * @param {[number, number]} coords
     * @returns {Promise<Point>}
     */
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

        /** получвем информацию о месте */
        const geocode = await window.ymaps.geocode(coords)
        const geoObject = geocode.geoObjects.get(0)
        /** преобразованная информация о месте */
        const markerInfo = this._markerInfo(geoObject)

        this.placemarks.push(markerInfo)
        this.map.geoObjects.add(markerInfo.placemark)
        this.autoZoom()
        return markerInfo
    }

    /**
     * Метод извлекаут информацию из геообъекта полученного от api
     * @param {Object} geoObject
     * @returns {Point}
     * @private
     */
    _markerInfo(geoObject) {
        if (!geoObject || typeof geoObject !== 'object') {
            throw new Error('[YandexMap._markerInfo] geoObject should be define and typeof "object"')
        }

        const coords = geoObject.geometry.getCoordinates()
        const {
            text: textAddress,
            kind
        } = geoObject.properties.getAll().metaDataProperty.GeocoderMetaData


        const placemark = this._newPlacemark(coords, textAddress)

        placemark.events.add('dragend', this._handlePlacemarkDragEnd.bind(this))

        return {placemark, coords, textAddress, kind}
    }


    _newPlacemark(coords, address = '') {
        return new window.ymaps.Placemark(coords, {
            hintContent: address,
            balloonContent: address,
        }, {
            preset: 'islands#darkOrangeIcon',
            // iconLayout: this.placemarkIcon,
            // iconLayout: 'default#image',
            // iconImageHref: locationIcon,
            // iconImageSize: [24, 24],
            // iconOffset: [-16, -32],
            draggable: true,
            cursor: 'pointer',
        })
    }

    /** обработка завершения перетаскивания */
    _handlePlacemarkDragEnd(e) {
        /** объект описывающий точку на карте (экземпляр Placemark в yandex maps api)  */
        const p = e.originalEvent.target
        const idx = this.placemarks.findIndex(plm => plm.placemark === p)

        if (~idx) {
            const point = this.placemarks[idx]
            /** удаляем точку с пржним адресом */
            this.placemarks = this.placemarks.filter(pm => pm !== point)
            /**
             * новые координаты места после перетаскивания
             * @type{[number, number]}
             */
            const coords = p.geometry.getCoordinates()
            /** удаление прежнего маркера с карты */
            this.map.geoObjects.remove(p)
            /** добавление точки с новыми координатами */
            this.addMarker(coords)
                .then(point => document.dispatchEvent(new CustomEvent('drag-point', {detail: {point, index: idx}})))
                .catch(this._handleError.bind(this))
        }
    }


    /**
     * Метод добавления места по переданному адресу
     * @param {string} address
     * @returns {Promise<Point | null>}
     */
    async addMarkerByAddress(address) {
        /** если место спереданным адресом уже существует, то возвращаем информацию о нем */
        const existingAddress = this.placemarks.find(p => p.textAddress === address)
        if (existingAddress) return existingAddress
        /** информация онайденном месте */
        const geocoder = window.ymaps.geocode(address)
        return await geocoder
            .then(res => {
                if (this.tempPlacemark) {
                    this.map.geoObjects.remove(this.tempPlacemark)
                    this.tempPlacemark = null
                }
                /** информация о найденом месте */
                const geoObject = res.geoObjects.get(0)
                if (geoObject) {
                    /** информация о новой метке */
                    const newMarker = this._markerInfo(geoObject)
                    this.placemarks.push(newMarker)
                    /** добавление маркера на карту */
                    this.map.geoObjects.add(newMarker.placemark)
                    this.autoZoom()
                    return newMarker
                } else {
                    return null
                }
            })
            .catch(this._handleError.bind(this))
    }

    /**
     * Метод добавляет место путем трансформации координат контейнера HTMLElement-а в мировые координаты
     * @param {[number, number]} coords
     */
    addMarkerByLocalCoords(coords) {
        if (!coords || !Array.isArray(coords) || coords.length !== 2)
            throw new Error(`
            [YandexMap] не коректный формат координат
            получено: ${coords},
            ожидается массив вида: [latitude, longitude]
            `)

        /**
         * координаты на глобальной карте
         * @type {[number, number]}
         */
        const transformedCoords = this.projection.fromGlobalPixels(
            this.map.converter.pageToGlobal(coords), this.map.getZoom()
        )

        this.addMarker(transformedCoords)
            .catch(this._handleError.bind(this))
    }

    /**
     * Метод трансформирует координат контейнера в мировые и удаляет ближайший к переданным координатам (coords) маркер
     * @param {[number, number]} coords
     */
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

    /**
     * удаление ближайшей к указанным координатам точки
     * @param {Point} placemark
     */
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
        return [...this.placemarks]//.map(p => ({placemark: p, coords: p.geometry.getCoordinates()}))
    }

    /** метод устанавливает центр карты и зум так, чтобы все точки на карте попадали в область видимости */
    autoZoom() {
        /** границы (левый верхний, правый нижний углы), в которые попадают все метки на карте */
        const bounds = this.map.geoObjects.getBounds()
        if (bounds) {
            /** установка видимой области карты */
            this.map.setBounds(bounds)
            /** итоговый зум карты */
            let zoom = this.map.getZoom()
            /** зум > 14, как мне кажется, слишком боьшой, поэтому ставим зум не больше 14 */
            zoom > 14 && (zoom = 14)
            this.zoom = Math.floor(zoom)
            /** пересчитаный зум */
            this.map.setZoom(this.zoom)
        }
    }

    /**
     * текущий зум карты
     * @returns {number}
     */
    getZoom() {
        return this.zoom
    }

    /**
     * установка зума карты
     * @param {number} zoomLevel диапазон: 0 - 19
     */
    setZoom(zoomLevel) {
        if (!zoomLevel || zoomLevel < 0 || zoomLevel > 19) return
        this.zoom = zoomLevel
        this.map.setZoom(zoomLevel, {duration: 300})
    }

    /**
     * Метод, добавляет к HTMLInputElement блок с подсказками
     * @param {string} elementID
     */
    setSuggestsTo(elementID) {
        if (!elementID || typeof elementID !== 'string') return

        /** обект (SuggestView), управляющий логикой отображения полсказок */
        const newSuggest = new window.ymaps.SuggestView(elementID, {results: 3})
        /** обработчик на событие "select" */
        newSuggest.events.add('select', this._selectSuggest.bind(this))
        this.suggest = newSuggest
    }

    /**
     * вывод сообщения об ошибке в консоль, отправка сообщения об ошибке на сервер, отображение всплывающего сообщения
     * @param {Error} err
     * @param {string} message - сообщение, отображаемое во всплывающем сообщении
     * @private
     */
    _handleError(err, message = 'Не удалось получить информацию о новом месте') {
        console.error(err)
        ErrorReport.sendReport(err).catch(console.error)
        /** добавление всплывающего сообщения в очередь */
        pushAlertMessage({type: "info", message})
    }

    /** удаление блока подсказок, привязанного к HTMLInputElement */
    removeSuggest() {
        if (this.suggest) {
            this.suggest.destroy()
            this.suggest = null
        }
    }

    /**
     * обработка события выбора подсказки
     * @param e
     * @returns {Promise<void>}
     * @private
     */
    async _selectSuggest(e) {
        if (this.tempPlacemark) {
            this.map.geoObjects.remove(this.tempPlacemark)
        }

        window.selectTarget = e.originalEvent.target

        const item = e.get('item')
        if (item) {
            const geocode = await window.ymaps.geocode(item.displayName)
            window.geocode = geocode
            const coords = geocode.geoObjects.get(0).geometry.getCoordinates()
            const {text: textAddress} = geocode.geoObjects.get(0).properties.getAll().metaDataProperty.GeocoderMetaData

            this.tempPlacemark = new window.ymaps.Placemark(coords, {
                hintContent: textAddress,
                balloonContent: textAddress,
            }, {
                preset: 'islands#darkOrangeIcon',
                iconLayout: this.placemarkIcon,
                iconOffset: [-16, -32],
                cursor: 'pointer',
            })
            this.tempPlacemark = this._newPlacemark(coords, textAddress)

            this.map.geoObjects.add(this.tempPlacemark)
            this.map.setCenter(coords, this.zoom || 14, {duration: 300})
            document.dispatchEvent(new CustomEvent('selected-point', {detail: textAddress}))
        }
    }


    // метод фокусируется на точке
    focusOnPoint(coords, zoomLevel) {
        this.map.setCenter(coords, zoomLevel || this.zoom, {duration: 300})
    }

    //метод пытается получить координаты средствами браузера или средствами yandex maps api
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


    enableUserTracking() {
        if ('geolocation' in navigator) {
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
        this.map.container.fitToViewport()
    }

    /** очистка карты от точек */
    clear() {
        this.placemarks.forEach(p => this.map.geoObjects.remove(p.placemark))
        this.placemarks = []
        this.tempPlacemark && this.map.geoObjects.remove(this.tempPlacemark)
        this.tempPlacemark = null
    }

    destroyMap() {
        this.locationWatchID && navigator.geolocation.clearWatch(this.locationWatchID)
        this.map && this.map.destroy()
        this.script && this.script.remove()
        this.suggest && this.suggest.destroy()
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
                                   markerClassName,
                                    location,
                               }) {
    return new Promise((resolve, reject) => {
        if (!mapContainerID) reject(new Error('[YandexMap] mapContainerID is required'))

        const element = document.getElementById(mapContainerID)
        if (!element) reject(new Error(`[YandexMap] Can't not find element with id ${mapContainerID}`))

        if (window.ymaps) resolve(window.ymaps)
        else {
            const script = document.createElement('script')
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${api_key}&lang=ru_RU&load=Map,Placemark,geoQuery,templateLayoutFactory,geolocation,map.Converter,geocode,SuggestView,templateLayoutFactory,route`

            //добавление yandex maps api в htmlDOM
            element.appendChild(script)

            script.onload = () => resolve(window.ymaps)
        }
    })
        .then(() => {
            return new Promise(resolve => {
                window.ymaps.ready(() => {
                    const map = new window.ymaps.Map(mapContainerID, {
                        center: location || [55.76, 37.64],
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
                                // iconLayout: this.placemarkIcon,
                                // iconLayout: this.placemarkIcon,
                                // iconOffset: [-16, -32],
                                draggable: true,
                            })
                            map.geoObjects.add(placemark)
                            placemarks.push(placemark)
                        }
                    }

                    resolve(new YandexMap({
                        mapContainerID,
                        suggestElementID,
                        iconClass,
                        placemarks,
                        map,
                        markerClassName
                    }))
                })
            })

        })
}
