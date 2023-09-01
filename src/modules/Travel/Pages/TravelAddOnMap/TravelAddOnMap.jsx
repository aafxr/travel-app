import {useEffect, useRef, useState} from "react";

import Container from "../../../../components/Container/Container";
import Button from "../../../../components/ui/Button/Button";
import {Input, PageHeader} from "../../../../components/ui";

import './TravelAddOnMap.css'

export default function TravelAddOnMap() {
    const mapRef = useRef()
    const [travelMap, setTravelMap] = useState()

    useEffect(() => {
        let script

        if (mapRef.current && !travelMap) {
            script = document.createElement('script')
            script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;apikey=<ваш API-ключ>&load=Map,Placemark,search,geolocation"
            script.type = 'text/javascript'
            document.body.append(script)
            script.onload = function () {
                console.log(window.ymaps)
                if (window.ymaps) {
                    window.ymaps.ready(function () {
                            const map = new window.ymaps.Map('map', {
                                center: [55.751574, 37.573856],
                                zoom: 7
                            })
                            setTravelMap(map)
                        }
                    );

                    //user geolocation
                    // console.log(window.ymaps.geolocation)
                    // ({
                    //     // Зададим способ определения геолокации
                    //     // на основе ip пользователя.
                    //     provider: 'yandex',
                    //     // Включим автоматическое геокодирование результата.
                    //     autoReverseGeocode: true
                    // }).then(function (result) {
                    //     console.log(result)
                    // });

                }
            }
        }

        return () => {
            script && script.remove()
            travelMap && travelMap.destroy()
        }
    }, [mapRef, travelMap])


    useEffect(() => {
        if (travelMap){
            travelMap.events.add('click', e => {
                const coords = e.get('coords')
                console.log(coords)
            })
        }
    }, [travelMap])

    function handleClick() {
        if (travelMap) {
            // travelMap.balloon.open(travelMap.getCenter(), {
            //     contentHeader: 'Однажды',
            //     contentBody: 'В студеную зимнюю пору' +
            //         ' <span style="color:red; font-weight:bold">Я</span>' +
            //         ' из лесу <b>вышел</b>',
            // });
            //
            // travelMap.hint.open([55.76, 37.38], 'Кто <em>поднимается</em> в гору?');
            // console.log(travelMap.getCenter())
            //
            // const myPlacemark = new window.ymaps.Placemark([55.7, 37.6], {
            //     balloonContentHeader: 'Однажды',
            //     balloonContentBody: 'В студеную зимнюю пору',
            //     balloonContentFooter: 'Мы пошли в гору',
            //     hintContent: 'Зимние происшествия'
            // });

            // const myGeoObject = new window.ymaps.GeoObject({
            //     // Описание геометрии.
            //     geometry: {
            //         type: "Point",
            //         coordinates: travelMap.getCenter()
            //     },
            //     // Свойства.
            //     properties: {
            //         // Контент метки.
            //         iconContent: 'Я тащусь',
            //         hintContent: 'Ну давай уже тащи',
            //         draggable: true,
            //         fill: true,
            //         fillColor: 'var(--color-primary)',
            //         fillMethod: 'stretch',
            //         fillImageHref: '/icons/location_on_24px.svg'
            //     }
            // })

            const myPlacemark = new window.ymaps.Placemark(travelMap.getCenter(), {
                hintContent: 'Собственный значок метки',
                balloonContent: 'Это красивая метка'
            }, {
                // Опции.
                // Необходимо указать данный тип макета.
                iconLayout: 'default#image',
                // Своё изображение иконки метки.
                iconImageHref: '/icons/location_on_24px.svg',
                // Размеры метки.
                iconImageSize: [32, 32],
                // Смещение левого верхнего угла иконки относительно
                // её "ножки" (точки привязки).
                iconImageOffset: [-16, -20],
                draggable: true,
                // fillColor: 'var(--color-primary)',
                // iconColor: '#FF8E09',
                // preset: "islands#circleDotIcon",
                // Задаем цвет метки (в формате RGB).
                // iconColor: '#ff0000'
            })


            // window.ymaps.route([
            //     'Королев',
            //     { type: 'viaPoint', point: 'Мытищи' },
            //     'Химки',
            //     { type: 'wayPoint', point: [55.811511, 37.312518] }
            // ], {
            //     mapStateAutoApply: true
            // }).then(function (route) {
            //     route.getPaths().options.set({
            //         // балун показывает только информацию о времени в пути с трафиком
            //         balloonContentLayout: window.ymaps.templateLayoutFactory.createClass('{{ properties.humanJamsTime }}'),
            //         // вы можете настроить внешний вид маршрута
            //         strokeColor: '0000ffff',
            //         opacity: 0.9
            //     });
            //     // добавляем маршрут на карту
            //     travelMap.geoObjects.add(route);
            // });



            console.log(myPlacemark)

            travelMap.geoObjects.add(myPlacemark)


                // travelMap.geoObjects.add(myPlacemark);
        }
    }

    return (
        <div className='wrapper'>
            <Container className='travel-map pb-20'>
                <PageHeader arrowBack title={'Направление'}/>
                <Input placeholder='Куда едем?'/>
            </Container>
            <div className='content'>
                <div ref={mapRef} id='map'/>

            </div>
            <div className='fixed-bottom-button'>
                <Button
                    onClick={handleClick}
                >
                    Продолжить
                </Button>
            </div>
        </div>
    )
}