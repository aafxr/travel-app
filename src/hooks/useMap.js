import {useEffect, useRef} from "react";
import {pushAlertMessage} from "../components/Alerts/Alerts";
import ErrorReport from "../controllers/ErrorReport";

export default function useMap({
                                   api_key,
                                   map_container_id,
                                   input_id,
                                   suggests_count,
                                   tracking_position,
    placemark_class,
                               }) {
    const mapContainerRef = useRef(/**@type{HTMLElement}*/null)
    const map = useRef({
        suggest: null,
        travelMap: null
    })

    // добавление yandex map api
    useEffect(() => {
        if (!map_container_id) {
            console.warn('[useMap] prop map_container_id is required')
            return
        }

        let script
        if (mapContainerRef.current && !window.ymaps) {
            script = document.createElement('script')
            script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=${api_key || ''}&load=Map,Placemark,search,geolocation,route,SuggestView,control.ZoomControl`
            script.type = 'text/javascript'
            document.body.append(script)

            script.onload = function () {
                window.ymaps.ready(function () {
                    navigator.geolocation.getCurrentPosition(
                        (loc) => {
                            const {coords: {latitude, longitude}} = loc
                            const placemark = new window.ymaps.Placemark([latitude,longitude],{
                                hintContent:'мои координаты'
                            })
                            window.placemark = placemark
                            map.current.position = placemark
                            map.current.travelMap = new window.ymaps.Map(map_container_id, {
                                center: [latitude, longitude],
                                zoom: 12
                            })
                            map.current.travelMap.geoObjects.add(placemark)
                            map.current.travelMap.events.add('scroll', e => console.log(e))

                        }, err => {
                            const placemark = new window.ymaps.Placemark([55.76, 37.64],{
                                hintContent:'мои координаты'
                            })
                            map.current.position = placemark
                            map.current.travelMap = new window.ymaps.Map(map_container_id, {
                                center: [55.76, 37.64],
                                zoom: 12
                            })
                            map.current.travelMap.geoObjects.add(placemark)
                        }
                    )
                })
            }
        }
        return () => script && script.remove()
    }, [])

    //добавление подсказок для input
    useEffect(() => {
        if (input_id && window.ymaps && map.current.travelMap) {
            if (map.current.suggest) map.current.suggest.destroy()
            map.current.suggest = new window.ymaps.SuggestView(input_id, {results: suggests_count || 5})
        }
        // return () => map.current.suggest && map.current.suggest.destroy()
    }, [input_id, suggests_count])

    //отслеживание прзиции пользователя
    useEffect(() => {
        let watchNumber
        if (map.current.travelMap && tracking_position) {
            watchNumber = navigator.geolocation.watchPosition(loc => {
                const {coords: {latitude, longitude}} = loc
                map.current.travelMap.setCenter([latitude, longitude], 12, {duration: 300})
            }, err => {
                pushAlertMessage({type: "danger", message: 'Геолокация заблокированна пользователем'})
                console.error(err)
                ErrorReport.sendError(err)
            })
        }
        return () => watchNumber && navigator.geolocation.clearWatch(watchNumber)
    }, [tracking_position])


    return mapContainerRef
}